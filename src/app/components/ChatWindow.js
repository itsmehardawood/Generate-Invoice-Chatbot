'use client';

import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { parseQuery, selectProducts, createInvoice, editInvoice, checkBackendHealth, isAuthenticated } from '../utils/api';

const ChatWindow = ({ 
  isSidebarCollapsed = false,
  onAuthRequired,
  onNewChatStarted,
  currentSessionId,
  sessionMessages = [],
  user
}) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const [currentQueryId, setCurrentQueryId] = useState(null);
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [storedInvoices, setStoredInvoices] = useState(new Map()); // Store invoices by ID for editing
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  
  // Enhanced app state for context-aware intent detection
  const [appState, setAppState] = useState({
    currentContext: 'parse',        // 'parse' | 'invoice_created' | 'viewing_invoice' | 'editing'
    activeInvoiceId: null,
    lastCreatedInvoice: null,
    conversationHistory: [],
    lastAction: null,               // 'created_invoice' | 'edited_invoice' | 'selected_products'
    lastActionTimestamp: null
  });
  
  const messagesEndRef = useRef(null);

  // Initialize messages based on session
  useEffect(() => {
    if (currentSessionId && sessionMessages.length > 0) {
      // Load messages from session
      console.log('Loading session messages into ChatWindow:', sessionMessages);
      setMessages(sessionMessages);
      setHasStartedChat(true);
      setIsLoadingSession(false);
    } else if (currentSessionId) {
      // Session selected but no messages yet - show loading
      setIsLoadingSession(true);
      // The loadSessionMessages function will handle setting the welcome message
    } else {
      // No session selected, show main welcome message
      setMessages([
        { 
          id: 1, 
          text: isAuthenticated() 
            ? `Hi ${user?.name || 'there'}! I'm your invoice generation assistant. I can help you create professional invoices. Please describe what products or services you need to invoice, and I'll help you get started!`
            : "Hi! I'm your invoice generation assistant. I can help you create professional invoices. Please sign in to save your chat history and access all features, or continue as a guest with limited functionality.", 
          sender: "assistant", 
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ]);
      setHasStartedChat(false);
      setIsLoadingSession(false);
    }
  }, [currentSessionId, sessionMessages, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check backend connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await checkBackendHealth();
      setBackendConnected(isConnected);
      
      if (!isConnected) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: "⚠️ Backend connection unavailable. Please ensure your FastAPI server is running at http://localhost:8000",
          sender: "assistant",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'error'
        }]);
      }
    };
    
    checkConnection();
  }, []);

  // Enhanced Intent Detection System
  const detectIntent = (userInput) => {
    const editKeywords = [
      'change', 'update', 'modify', 'edit', 'correct', 'fix', 'replace',
      'set', 'make', 'alter', 'adjust', 'revise', 'amend'
    ];
    
    const editPhrases = [
      'change recipient to',
      'update notes',
      'modify address',
      'set building site',
      'change customer name',
      'update total',
      'edit invoice',
      'change the recipient',
      'update the notes',
      'modify the address',
      'change notes to',
      'set recipient to',
      'update recipient to'
    ];
    
    const inputLower = userInput.toLowerCase();
    
    // Check for edit phrases first (more specific)
    const hasEditPhrase = editPhrases.some(phrase => inputLower.includes(phrase));
    if (hasEditPhrase) return 'edit';
    
    // Check for edit keywords with invoice context
    const hasEditKeyword = editKeywords.some(keyword => inputLower.includes(keyword));
    const hasInvoiceContext = inputLower.includes('invoice') || inputLower.includes('receipt');
    
    if (hasEditKeyword && hasInvoiceContext) return 'edit';
    
    // Context-based detection: if we just created an invoice and user uses edit words
    if (hasEditKeyword && appState.currentContext === 'invoice_created') return 'edit';
    
    // For everything else (product search and general chat), let the backend decide
    // The /parse endpoint now handles both product search and general chat automatically
    return 'parse';
  };

  // Smart context-aware input handler
  const handleSmartInput = async (userInput) => {
    const intent = detectIntent(userInput);
    const hasRecentInvoice = appState.lastCreatedInvoice || appState.activeInvoiceId;
    const timeSinceLastAction = appState.lastActionTimestamp ? 
      Date.now() - appState.lastActionTimestamp : Infinity;
    
    // If intent is edit and we have a recent invoice (within 10 minutes)
    if (intent === 'edit' && hasRecentInvoice && timeSinceLastAction < 600000) {
      const invoiceId = appState.lastCreatedInvoice?.id || appState.activeInvoiceId;
      return await handleEditRequest(userInput, invoiceId);
    } 
    // If intent is edit but no recent invoice
    else if (intent === 'edit' && !hasRecentInvoice) {
      const errorResponse = {
        id: Date.now(),
        text: "❌ No active invoice to edit. Please create an invoice first or specify which invoice to edit.",
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'error'
      };
      setMessages(prev => [...prev, errorResponse]);
      return true; // Handled
    }
    // If intent is edit but invoice is too old
    else if (intent === 'edit' && hasRecentInvoice && timeSinceLastAction >= 600000) {
      const errorResponse = {
        id: Date.now(),
        text: "❌ The last invoice is too old to edit. Please create a new invoice or specify which invoice to edit by ID.",
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'error'
      };
      setMessages(prev => [...prev, errorResponse]);
      return true; // Handled
    }
    // Default to parse for product requests
    else {
      return await handleParseRequest(userInput);
    }
  };

  // Handle edit requests
  const handleEditRequest = async (userInput, invoiceId) => {
    try {
      setIsLoading(true);
      
      // Update app state
      setAppState(prev => ({
        ...prev,
        currentContext: 'editing',
        activeInvoiceId: invoiceId
      }));
      
      const lastInvoice = storedInvoices.get(invoiceId);
      if (!lastInvoice) {
        throw new Error('Invoice not found in local storage');
      }

      // Send edit request to backend
      const editResult = await editInvoice(invoiceId, userInput);
      
      if (editResult.success) {
        // Update stored invoice with new data
        const updatedInvoice = {
          ...lastInvoice,
          data: editResult.updated_invoice_data
        };
        setStoredInvoices(prev => new Map(prev.set(invoiceId, updatedInvoice)));
        
        // Update app state
        setAppState(prev => ({
          ...prev,
          currentContext: 'viewing_invoice',
          lastAction: 'edited_invoice',
          lastActionTimestamp: Date.now(),
          lastCreatedInvoice: updatedInvoice
        }));
        
        // Create response message with highlighted changes
        const aiResponse = {
          id: Date.now(),
          text: `✅ ${editResult.message}\n\nHere's your updated invoice with changes highlighted in yellow:`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'invoice-card-edited',
          invoiceData: updatedInvoice,
          originalInvoiceData: lastInvoice, // For comparison
          invoiceId: invoiceId,
          invoiceStatus: lastInvoice.status,
          createdAt: lastInvoice.created_at
        };
        
        setMessages(prev => [...prev, aiResponse]);
        return true;
      }
    } catch (error) {
      console.error('Error editing invoice:', error);
      
      const errorResponse = {
        id: Date.now(),
        text: `❌ Error editing invoice: ${error.message}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'error'
      };
      
      setMessages(prev => [...prev, errorResponse]);
      return true; // We handled the request, even if it failed
    } finally {
      setIsLoading(false);
    }
  };

  // Handle parse requests (product search and general chat)
  const handleParseRequest = async (userInput) => {
    try {
      // Update app state
      setAppState(prev => ({
        ...prev,
        currentContext: 'parse',
        activeInvoiceId: null
      }));

      // Parse user query with backend
      const parseResult = await parseQuery(userInput);
      
      // Check response type and handle accordingly
      if (parseResult.response_type === "general_chat") {
        // Handle general chat response
        const assistantResponse = {
          id: Date.now(),
          text: parseResult.message,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'general_chat'
        };

        setMessages(prev => [...prev, assistantResponse]);
        
        // Update app state for general chat
        setAppState(prev => ({
          ...prev,
          currentContext: 'general_chat',
          lastAction: 'general_chat',
          lastActionTimestamp: Date.now()
        }));
        
        return true;
      } 
      else if (parseResult.response_type === "product_search") {
        // Handle product search response
        
        // Set the current query ID for product selection
        setCurrentQueryId(parseResult.query_id);
        
        // Transform backend products to frontend format if needed
        const transformedProducts = parseResult.matched_products?.map(product => ({
          id: product.id,
          name: product.P_name || product.name,
          code: product.P_code || product.code,
          description: product.description || `${product.P_name || product.name} - Climate Zone ${product.climate_zone || 'N/A'}`,
          price: product.totale || product.price || 0,
          installation: product.installazione || product.installation || 0,
          climate_zone: product.climate_zone,
          similarity_score: product.similarity_score
        })) || [];
        
        const assistantResponse = {
          id: Date.now(),
          text: `Great! I found ${parseResult.matched_products?.length || 0} products matching your request. ${parseResult.extracted_items ? 
            `I extracted: ${parseResult.extracted_items.map(item => `${item.quantity} ${item.name}`).join(', ')}.` : ''} Please review and select the items you'd like to include in your invoice:`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'product-selection',
          products: transformedProducts,
          selectedProducts: [],
          queryId: parseResult.query_id,
          extractedItems: parseResult.extracted_items
        };

        setMessages(prev => [...prev, assistantResponse]);
        
        // Update app state for product search
        setAppState(prev => ({
          ...prev,
          currentContext: 'product_search',
          lastAction: 'parsed_query',
          lastActionTimestamp: Date.now()
        }));
        
        return true;
      }
      else {
        // Fallback for unknown response types
        const assistantResponse = {
          id: Date.now(),
          text: "I received an unexpected response format from the backend. Please try again.",
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'error'
        };

        setMessages(prev => [...prev, assistantResponse]);
        return true;
      }
    } catch (error) {
      console.error('Error parsing query:', error);
      throw error; // Let the calling function handle this
    }
  };

  // // Sample product data
  // const sampleProducts = [
  //   { id: 1, name: 'Web Development', description: 'Custom website development', price: 2500.00 },
  //   { id: 2, name: 'Logo Design', description: 'Professional logo design', price: 500.00 },
  //   { id: 3, name: 'SEO Optimization', description: 'Search engine optimization', price: 800.00 },
  //   { id: 4, name: 'Content Writing', description: 'Professional content creation', price: 300.00 },
  //   { id: 5, name: 'Social Media Setup', description: 'Social media account setup and branding', price: 400.00 }
  // ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;

    // Check if user is authenticated and needs to create a session
    if (!isAuthenticated()) {
      onAuthRequired?.();
      return;
    }

    // If this is the first message in a new chat session, create the session
    if (!hasStartedChat && !currentSessionId) {
      const sessionId = await onNewChatStarted?.(inputText.trim());
      if (!sessionId) {
        // Failed to create session, show error
        const errorMessage = {
          id: Date.now(),
          text: 'Failed to create chat session. Please try again.',
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'error'
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }
      setHasStartedChat(true);
    }

    // Add user message
    const newUserMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    const userInput = inputText.trim();
    setInputText('');
    setIsLoading(true);

    try {
      // Use the smart input handler
      await handleSmartInput(userInput);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Check if it's an authentication error
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        onAuthRequired?.();
        return;
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error processing your request. Please try again.',
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOfflineResponse = (userInput) => {
    // Enhanced fallback responses when backend is not available
    setTimeout(() => {
      const sampleProducts = [
        { id: 1, name: 'Web Development', description: 'Custom website development', price: 2500.00 },
        { id: 2, name: 'Logo Design', description: 'Professional logo design', price: 500.00 },
        { id: 3, name: 'SEO Optimization', description: 'Search engine optimization', price: 800.00 },
        { id: 4, name: 'Content Writing', description: 'Professional content creation', price: 300.00 },
        { id: 5, name: 'Social Media Setup', description: 'Social media account setup and branding', price: 400.00 }
      ];

      let aiResponse = {};
      const userInputLower = userInput.toLowerCase();
      
      // Check if it's a product-related query
      if (userInputLower.includes('product') || userInputLower.includes('pdc') || 
          userInputLower.includes('heat pump') || userInputLower.includes('argo') ||
          userInputLower.includes('invoice') || userInputLower.includes('quote')) {
        aiResponse = {
          id: Date.now() + 1,
          text: "⚠️ Backend offline - showing sample products. Here are some example products:",
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'product-selection',
          products: sampleProducts,
          selectedProducts: [],
          isOffline: true
        };
      } 
      // Handle general greetings and questions offline
      else if (userInputLower.includes('hello') || userInputLower.includes('hi') || 
               userInputLower.includes('help') || userInputLower.includes('what') ||
               userInputLower.includes('how') || userInputLower.includes('can you')) {
        aiResponse = {
          id: Date.now() + 1,
          text: "⚠️ I'm currently in offline mode due to backend connectivity issues. While I can't access the full product database or AI chat features right now, I can still help you with basic invoice operations using sample data.\n\nTo restore full functionality including:\n• Product search and matching\n• Smart general chat responses\n• Real invoice creation\n\nPlease ensure your FastAPI server is running at https://greengenius.crm-labloid.com",
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'general_chat'
        };
      }
      // Default offline response
      else {
        aiResponse = {
          id: Date.now() + 1,
          text: "⚠️ Backend connection unavailable. I'm running in offline mode with limited functionality. Please ensure your FastAPI server is running at http://localhost:8000 for full features including product search and smart chat responses.",
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'error'
        };
      }
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleProductSelect = async (selectedProducts, queryId) => {
    if (selectedProducts.length === 0) {
      const warningResponse = {
        id: Date.now(),
        text: "⚠️ Please select at least one product before proceeding with the invoice creation.",
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'warning'
      };
      
      setMessages(prev => [...prev, warningResponse]);
      return;
    }

    setIsLoading(true);
    
    try {
   

      // Call backend to create invoice draft
      const draftResult = await selectProducts(queryId, selectedProducts);
      setCurrentDraftId(draftResult.draft_id);
      
      const aiResponse = {
        id: Date.now(),
        text: "Perfect! I've created an invoice draft with your selected products. Please review and edit the details below:",
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'invoice-preview',
        invoiceData: draftResult.invoice_data,
        draftId: draftResult.draft_id
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error selecting products:', error);
      
      const errorResponse = {
        id: Date.now(),
        text: `Error creating invoice draft: ${error.message}. Please try again.`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'error'
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

 
  const handleInvoiceUpdate = (invoiceData) => {
    // Handle invoice updates (save to local state)
    console.log('Invoice updated:', invoiceData);
    
    // You could add logic here to save draft updates to backend
    // if you implement a draft update endpoint
  };

  const handleInvoiceFinalize = async (invoiceData, draftId) => {
    setIsLoading(true);
    
    try {
      if (!backendConnected || !draftId) {
        // Fallback for offline mode
        handleOfflineInvoiceFinalization(invoiceData);
        return;
      }

      // Create the invoice request payload matching the API specification
      const createInvoiceRequest = {
        draft_id: draftId,
        recipient: invoiceData.recipient,
        building_site: invoiceData.building_site,
        notes: invoiceData.notes
      };

      // Create final invoice via backend
      const finalInvoice = await createInvoice(createInvoiceRequest.draft_id, {
        recipient: createInvoiceRequest.recipient,
        building_site: createInvoiceRequest.building_site,
        notes: createInvoiceRequest.notes
      });

      // Store the invoice data locally for future editing
      setStoredInvoices(prev => new Map(prev.set(finalInvoice.id, finalInvoice)));
      
      // Update app state to track the active invoice
      setAppState(prev => ({
        ...prev,
        currentContext: 'invoice_created',
        activeInvoiceId: finalInvoice.id,
        lastCreatedInvoice: finalInvoice,
        lastAction: 'created_invoice',
        lastActionTimestamp: Date.now()
      }));
      
      const aiResponse = {
        id: Date.now(),
        text: `🎉 Excellent! Your invoice has been successfully created and saved to the database (ID: ${finalInvoice.id}). Here's your finalized invoice:\n\n💡 **Tip**: You can edit this invoice by simply asking me! For example: "Change the recipient to John Smith" or "Update the notes to include installation date"`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'invoice-card',
        invoiceData: finalInvoice,
        invoiceId: finalInvoice.id,
        invoiceStatus: finalInvoice.status,
        createdAt: finalInvoice.created_at
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Reset query/draft state but keep active invoice for editing
      setCurrentQueryId(null);
      setCurrentDraftId(null);
    } catch (error) {
      console.error('Error finalizing invoice:', error);
      
      const errorResponse = {
        id: Date.now(),
        text: `Error creating final invoice: ${error.message}. Please try again or contact support.`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'error'
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOfflineInvoiceFinalization = (invoiceData) => {
    setTimeout(() => {
      // Generate a temporary ID for offline invoices
      const tempInvoiceId = `offline_${Date.now()}`;
      const offlineInvoice = { ...invoiceData, id: tempInvoiceId };
      
      // Store the offline invoice for editing
      setStoredInvoices(prev => new Map(prev.set(tempInvoiceId, offlineInvoice)));
      
      // Update app state to track the active invoice
      setAppState(prev => ({
        ...prev,
        currentContext: 'invoice_created',
        activeInvoiceId: tempInvoiceId,
        lastCreatedInvoice: offlineInvoice,
        lastAction: 'created_invoice',
        lastActionTimestamp: Date.now()
      }));
      
      const aiResponse = {
        id: Date.now(),
        text: "⚠️ Offline mode - showing final invoice preview (not saved to database):\n\n💡 **Tip**: You can still edit this invoice by asking me! For example: \"Change the recipient to John Smith\"",
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'invoice-card',
        invoiceData: offlineInvoice,
        invoiceId: tempInvoiceId,
        isOffline: true
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const suggestions = [
    "I need 2 PDC units for installation",
    "Quote for ARGO16 heat pump climate zone A",
    "Invoice for 3 PDC units zone B installation",
    "I need PDC equipment for new building project"
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-800">
      {/* Header - Only fixed on larger screens, positioned to adjust with sidebar collapse */}
      <div className={`lg:fixed lg:top-0 lg:right-0 lg:z-40 p-3 lg:p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:left-16 xl:left-20' : 'lg:left-64'
      }`}>
        <div className="flex items-center">
          <div className={`h-2 w-2 lg:h-3 lg:w-3 rounded-full mr-2 lg:mr-3 ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <h2 className="text-gray-900 dark:text-white font-semibold text-sm lg:text-base">Invoice Assistant</h2>
        </div>
        <div className="flex items-center text-xs lg:text-sm">
          <span className={`px-2 py-1 rounded-full text-xs ${
            backendConnected 
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}>
            <span className="hidden sm:inline">{backendConnected ? 'Online' : ' Offline'}</span>
            <span className="sm:hidden">{backendConnected ? 'Online' : 'Offline'}</span>
          </span>
        </div>
      </div>

      {/* Messages Area - Different padding for mobile vs desktop */}
      <div className="flex-1 overflow-y-auto p-2 lg:p-4 lg:pt-20">
        {isLoadingSession ? (
          /* Loading Session Messages */
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex items-center justify-center mb-4">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Loading conversation...</p>
          </div>
        ) : messages.length === 1 ? (
          /* Welcome Message */
          <div className="flex flex-col items-center justify-center h-full pb-8 lg:pb-16 px-4">
            <div className="mb-6 lg:mb-8 text-center max-w-md">
              <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 lg:mb-4">Invoice Generator</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-lg mb-2">
                AI-powered invoice creation with Python backend
              </p>
              <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-500">
                Simply describe what you need to invoice and I will find matching products
              </p>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="max-w-6xl mx-auto">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onProductSelect={handleProductSelect}
                onInvoiceUpdate={handleInvoiceUpdate}
                onInvoiceFinalize={handleInvoiceFinalize}
              />
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-4 lg:mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 lg:p-4 shadow-lg mr-4 lg:mr-8">
                  <div className="flex items-start">
                    <div className="mr-2 lg:mr-3 mt-1 flex-shrink-0">
                      <div className="h-6 w-6 lg:h-8 lg:w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
   <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
  <div className="w-full max-w-4xl mx-auto">
    <form 
      onSubmit={handleSendMessage} 
      className="flex items-end gap-2 sm:gap-3 lg:gap-4 w-full"
    >
      <div className="flex-1 relative">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me to create an invoice"
          className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl 
                     py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 
                     pr-10 sm:pr-12 lg:pr-14 
                     resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 
                     border border-gray-200 dark:border-gray-600 
                     text-sm sm:text-base"
          rows="1"
          style={{ minHeight: '44px', maxHeight: '160px', overflowY: 'auto' }}
        />
        <button
          type="submit"
          disabled={inputText.trim() === '' || isLoading}
          className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 
                     p-1.5 sm:p-2 rounded-lg 
                     bg-blue-600 text-white 
                     disabled:bg-gray-400 disabled:cursor-not-allowed 
                     hover:bg-blue-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
               className="h-4 w-4 sm:h-5 sm:w-5" 
               viewBox="0 0 20 20" 
               fill="currentColor">
            <path fillRule="evenodd" 
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
                  clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </form>

    <div className="mt-2 sm:mt-3 text-xs text-gray-500 dark:text-gray-400 text-center px-2 sm:px-4">
      Invoice Assistant can help you create professional invoices. Start by asking for products or invoice creation.
    </div>
  </div>
</div>

    </div>
  );
};

export default ChatWindow;