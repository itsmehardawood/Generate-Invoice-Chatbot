'use client'
import { useState, useEffect } from 'react';
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/sidebar";
import AuthModal from "../components/AuthModal";
import { isAuthenticated, createChatSession, getSessionMessages, generateChatTitle, transformBackendMessages, initializeAuth } from "../utils/api";

export default function ChatLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sessionMessages, setSessionMessages] = useState([]);

  // Check authentication status on component mount
  useEffect(() => {
    // Initialize authentication system
    const cleanup = initializeAuth();
    
    if (isAuthenticated()) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      // Get current session if exists
      const currentSession = localStorage.getItem('current_session_id');
      if (currentSession) {
        setCurrentSessionId(currentSession);
        loadSessionMessages(currentSession);
      }
    }

    // Cleanup function
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const loadSessionMessages = async (sessionId) => {
    try {
      console.log('Loading messages for session:', sessionId);
      const messages = await getSessionMessages(sessionId);
      console.log('Loaded messages:', messages);
      
      // If no messages in session, show welcome message for this specific session
      if (!messages || messages.length === 0) {
        const welcomeMessage = {
          id: `welcome-${sessionId}`,
          text: `This is the start of your conversation. What can I help you with today?`,
          sender: "assistant",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setSessionMessages([welcomeMessage]);
      } else {
        setSessionMessages(messages);
      }
    } catch (error) {
      console.error('Error loading session messages:', error);
      setSessionMessages([]);
      // You could show an error message to the user here
    }
  };

  const handleAuthSuccess = (authData) => {
    setUser(authData.user);
    setIsAuthModalOpen(false);
  };

  const handleAuthRequired = () => {
    setIsAuthModalOpen(true);
  };

  const handleSessionSelect = async (sessionId) => {
    console.log('Session selected:', sessionId);
    setCurrentSessionId(sessionId);
    localStorage.setItem('current_session_id', sessionId);
    
    // Clear current messages first to show loading state
    setSessionMessages([]);
    
    // Load messages for the selected session
    await loadSessionMessages(sessionId);
    
    // Close sidebar on mobile after selecting session
    setIsSidebarOpen(false);
  };

  const handleNewChatStarted = async (firstMessage) => {
    if (!isAuthenticated()) {
      handleAuthRequired();
      return;
    }

    try {
      // Generate title from first message
      const title = generateChatTitle(firstMessage);
      
      // Create new session
      const newSession = await createChatSession(title);
      setCurrentSessionId(newSession.id);
      
      // Clear session messages for new chat
      setSessionMessages([]);
      
      return newSession.id;
    } catch (error) {
      console.error('Error starting new chat:', error);
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        handleAuthRequired();
      }
      return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 relative">
      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative lg:translate-x-0 inset-y-0 left-0 z-50 lg:z-auto
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          onClose={() => setIsSidebarOpen(false)} 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onAuthRequired={handleAuthRequired}
          onSessionSelect={handleSessionSelect}
          currentSessionId={currentSessionId}
          user={user}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Mobile Header with Menu Button */}
        <div className="lg:hidden flex items-center justify-between p-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-base font-semibold text-gray-900 dark:text-white truncate">Invoice Generator</h1>
          <div className="w-9 flex justify-end">
        
          </div>
        </div>
        
        <div className="flex-1 flex flex-col min-h-0">
          <ChatWindow 
            isSidebarCollapsed={isSidebarCollapsed}
            onAuthRequired={handleAuthRequired}
            onNewChatStarted={handleNewChatStarted}
            currentSessionId={currentSessionId}
            sessionMessages={sessionMessages}
            user={user}
          />
        </div>
      </div>
    </div>
  );
}