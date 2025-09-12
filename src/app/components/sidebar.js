'use client';

import { useState, useEffect } from 'react';
import { 
  getUserSessions, 
  createChatSession, 
  generateChatTitle, 
  isAuthenticated, 
  logout,
  deleteSession,
  updateChatSessionName 
} from '../utils/api';
import Link from 'next/link';

const Sidebar = ({ 
  onClose, 
  isCollapsed = true, 
  onToggleCollapse, 
  onAuthRequired,
  onSessionSelect,
  currentSessionId,
  user 
}) => {
  const [sessions, setSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [error, setError] = useState('');
  const [deletingSessionId, setDeletingSessionId] = useState(null);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [updatingSessionId, setUpdatingSessionId] = useState(null);

  // Load user sessions on component mount and when user changes
  useEffect(() => {
    if (isAuthenticated() && user) {
      loadUserSessions();
    } else {
      setSessions([]);
    }
  }, [user]);

  const loadUserSessions = async () => {
    try {
      setIsLoadingSessions(true);
      setError('');
      const userSessions = await getUserSessions();
      setSessions(userSessions || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setError('Failed to load chat history');
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        onAuthRequired?.();
      }
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const filteredSessions = sessions.filter(session => 
    session.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewChat = async () => {
    if (!isAuthenticated()) {
      onAuthRequired?.();
      return;
    }

    try {
      // Get client name from user object or use default
      const clientName = user?.name || 'Cliente';
      
      // Create new session with client-based title
      const newSession = await createChatSession(null, clientName);
      setSessions(prev => [newSession, ...prev]);
      
      // Select the new session
      onSessionSelect?.(newSession.id);
    } catch (error) {
      console.error('Error creating new chat:', error);
      setError('Failed to create new chat');
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        onAuthRequired?.();
      }
    }
  };

  const handleSessionClick = (sessionId) => {
    onSessionSelect?.(sessionId);
  };

  const handleDeleteSession = async (sessionId, e) => {
    // e.stopPropagation(); // Prevent session selection when clicking delete
    
    // if (!confirm('Are you sure you want to delete this chat session?')) {
    //   return;
    // }

    try {
      setDeletingSessionId(sessionId);
      await deleteSession(sessionId);
      
      // Remove session from local state
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      
      // If the deleted session was the current one, trigger onSessionSelect with null
      if (currentSessionId === sessionId) {
        onSessionSelect?.(null);
      }
      
    } catch (error) {
      console.error('Error deleting session:', error);
      setError('Failed to delete chat session');
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        onAuthRequired?.();
      }
    } finally {
      setDeletingSessionId(null);
    }
  };

  const handleEditSessionTitle = (sessionId, currentTitle, e) => {
    e.stopPropagation(); // Prevent session selection when clicking edit
    setEditingSessionId(sessionId);
    setEditingTitle(currentTitle);
  };

  const handleSaveSessionTitle = async (sessionId, e) => {
    if (e) e.stopPropagation();
    
    if (!editingTitle.trim() || editingTitle === sessions.find(s => s.id === sessionId)?.title) {
      setEditingSessionId(null);
      setEditingTitle('');
      return;
    }

    try {
      setUpdatingSessionId(sessionId);
      const updatedSession = await updateChatSessionName(sessionId, editingTitle.trim());
      
      // Update session in local state
      setSessions(prev => prev.map(session => 
        session.id === sessionId ? { ...session, title: updatedSession.title } : session
      ));
      
      setEditingSessionId(null);
      setEditingTitle('');
    } catch (error) {
      console.error('Error updating session title:', error);
      setError('Failed to update chat title');
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        onAuthRequired?.();
      }
    } finally {
      setUpdatingSessionId(null);
    }
  };

  const handleCancelEdit = (e) => {
    if (e) e.stopPropagation();
    setEditingSessionId(null);
    setEditingTitle('');
  };

  const handleTitleKeyPress = (sessionId, e) => {
    if (e.key === 'Enter') {
      handleSaveSessionTitle(sessionId);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleLogout = () => {
    logout();
    setSessions([]);
    onAuthRequired?.();
  };

  const handleSignIn = () => {
    onAuthRequired?.();
  };

  // Group sessions by date
  const groupSessionsByDate = (sessions) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: []
    };

    sessions.forEach(session => {
      const sessionDate = new Date(session.created_at);
      const sessionDay = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());

      if (sessionDay.getTime() === today.getTime()) {
        groups.today.push(session);
      } else if (sessionDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(session);
      } else if (sessionDate >= weekAgo) {
        groups.thisWeek.push(session);
      } else {
        groups.older.push(session);
      }
    });

    return groups;
  };

  const sessionGroups = groupSessionsByDate(filteredSessions);

  const SessionGroup = ({ title, sessions }) => {
    if (sessions.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          {title}
        </h3>
        <div className="space-y-1">
          {sessions.map(session => (
            <div
              key={session.id}
              className={`relative group rounded-lg transition-colors duration-150 ${
                currentSessionId === session.id
                  ? 'bg-gray-800'
                  : 'hover:bg-gray-800'
              }`}
            >
              <button
                onClick={() => handleSessionClick(session.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center transition-colors duration-150 ${
                  currentSessionId === session.id
                    ? 'text-white'
                    : 'text-gray-300 group-hover:text-white'
                }`}
                disabled={editingSessionId === session.id}
              >
                <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full mr-3 flex-shrink-0 bg-green-400"></div>
                {editingSessionId === session.id ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => handleTitleKeyPress(session.id, e)}
                    onBlur={() => handleSaveSessionTitle(session.id)}
                    className="flex-1 bg-gray-700 text-white px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="truncate transition-colors flex-1">
                    {session.title}
                  </span>
                )}
              </button>
              
              {/* Action Buttons */}
              {editingSessionId === session.id ? (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  {updatingSessionId === session.id ? (
                    <div className="p-1.5">
                      <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={(e) => handleSaveSessionTitle(session.id, e)}
                        className="p-1 rounded-md hover:bg-green-600 transition-all duration-150"
                        title="Save title"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 rounded-md hover:bg-gray-600 transition-all duration-150"
                        title="Cancel edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={(e) => handleEditSessionTitle(session.id, session.title, e)}
                    className="p-1 rounded-md hover:bg-blue-600 transition-all duration-150"
                    title="Edit title"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    disabled={deletingSessionId === session.id}
                    className="p-1 rounded-md hover:bg-red-600 transition-all duration-150 disabled:opacity-50"
                    title="Delete chat session"
                  >
                    {deletingSessionId === session.id ? (
                      <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-full bg-gray-900 text-white transition-all duration-300 ${
      isCollapsed ? 'w-16 lg:w-20' : 'w-72 sm:w-80 lg:w-64'
    }`}>
      
      {/* App Name */}
      <div className="p-4 border-b text-center border-gray-800">
        {!isCollapsed ? (
          <Link href="/" className="text-xl font-bold text-green-500 tracking-wide">
            GreenGenius Bot
          </Link>
        ) : (
          <Link href="/" className="text-lg font-bold text-green-500">G</Link>
        )}
      </div>

      {/* Header */}
      <div className="p-3 lg:p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3 lg:hidden">
          <h2 className="text-base font-semibold">Menu</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-gray-800 transition-colors"
          >
            {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg> */}
          </button>
        </div>
        
        {!isCollapsed && (
          <button 
            onClick={handleNewChat}
            disabled={!isAuthenticated()}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 border border-gray-600 text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 lg:h-5 lg:w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>New Chat</span>
          </button>
        )}
        {isCollapsed && (
          <button 
            onClick={handleNewChat}
            disabled={!isAuthenticated()}
            className="w-full flex items-center justify-center p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 lg:h-5 lg:w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Search (only visible when expanded and authenticated) */}
      {!isCollapsed && isAuthenticated() && (
        <div className="p-3 lg:p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            />
          </div>
        </div>
      )}

      {/* Auth Required Message (when not authenticated) */}
      {!isCollapsed && !isAuthenticated() && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-sm text-gray-400 mb-4">Please sign in to view your chat history</p>
            <button
              onClick={handleSignIn}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* Chat History (only visible when expanded and authenticated) */}
      {!isCollapsed && isAuthenticated() && (
        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="p-3 text-center">
              <p className="text-xs text-red-400">{error}</p>
              <button
                onClick={loadUserSessions}
                className="mt-2 text-xs text-blue-400 hover:text-blue-300"
              >
                Retry
              </button>
            </div>
          )}
          
          {isLoadingSessions ? (
            <div className="p-3 text-center">
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-2 text-sm text-gray-400">Loading chats...</span>
              </div>
            </div>
          ) : (
            <div className="p-3">
              <SessionGroup title="Today" sessions={sessionGroups.today} />
              <SessionGroup title="Yesterday" sessions={sessionGroups.yesterday} />
              <SessionGroup title="Previous 7 Days" sessions={sessionGroups.thisWeek} />
              <SessionGroup title="Older" sessions={sessionGroups.older} />
              
              {sessions.length === 0 && !isLoadingSessions && (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400">No chat history yet</p>
                  <p className="text-xs text-gray-500 mt-1">Start a new conversation!</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="p-3 lg:p-4 border-t border-gray-700">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              {isAuthenticated() && user ? (
                <>
                  <div className="h-8 w-8 lg:h-9 lg:w-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate text-white">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-8 w-8 lg:h-9 lg:w-9 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">?</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate text-white">Guest User</p>
                    <p className="text-xs text-gray-400 truncate">Not signed in</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {isAuthenticated() && (
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-md hover:bg-gray-800 transition-colors"
                  title="Sign out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              )}
              <button 
                onClick={onToggleCollapse}
                className="p-1.5 rounded-md hover:bg-gray-800 hidden lg:block transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <button 
              onClick={onToggleCollapse}
              className="p-1.5 rounded-md hover:bg-gray-800 hidden lg:block transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="h-8 w-8 lg:h-9 lg:w-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {isAuthenticated() && user ? (user.name?.charAt(0)?.toUpperCase() || 'U') : '?'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;




