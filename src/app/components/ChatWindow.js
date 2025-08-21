'use client';

import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { parseQuery, selectProducts, createInvoice, editInvoice, checkBackendHealth } from '../utils/api';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm your invoice generation assistant. I can help you create professional invoices. Please describe what products or services you need to invoice, and I'll help you get started!", 
      sender: "assistant", 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const [currentQueryId, setCurrentQueryId] = useState(null);
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [storedInvoices, setStoredInvoices] = useState(new Map()); // Store invoices by ID for editing
  
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
  const [currentChat, setCurrentChat] = useState(null);

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
          text: "⚠️ Backend connection unavailable. Please ensure your FastAPI server is running at http://127.0.0.1:8000",
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
    
    // Default to parse for product requests
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

  // Handle parse requests (product search)
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
      
      // Set the current query ID for product selection
      setCurrentQueryId(parseResult.query_id);
      
      // Update app state
      setAppState(prev => ({
        ...prev,
        currentContext: 'parse',
        lastAction: 'parsed_query',
        lastActionTimestamp: Date.now()
      }));

      const assistantResponse = {
        id: Date.now(),
        text: `Great! I found ${parseResult.matched_products.length} products matching your request. Please review and select the items you'd like to include in your invoice:`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'product-selection',
        products: parseResult.matched_products,
        selectedProducts: [],
        queryId: parseResult.query_id
      };

      setMessages(prev => [...prev, assistantResponse]);
      return true;
    } catch (error) {
      console.error('Error parsing query:', error);
      throw error; // Let the calling function handle this
    }
  };

  // Sample product data
  const sampleProducts = [
    { id: 1, name: 'Web Development', description: 'Custom website development', price: 2500.00 },
    { id: 2, name: 'Logo Design', description: 'Professional logo design', price: 500.00 },
    { id: 3, name: 'SEO Optimization', description: 'Search engine optimization', price: 800.00 },
    { id: 4, name: 'Content Writing', description: 'Professional content creation', price: 300.00 },
    { id: 5, name: 'Social Media Setup', description: 'Social media account setup and branding', price: 400.00 }
  ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;

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
    // Fallback responses when backend is not available
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
      
      if (userInputLower.includes('product') || userInputLower.includes('select') || userInputLower.includes('choose')) {
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
      } else {
        aiResponse = {
          id: Date.now() + 1,
          text: "⚠️ Backend connection unavailable. I'm running in offline mode with limited functionality. Please ensure your FastAPI server is running at http://127.0.0.1:8000 for full features.",
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
      if (!backendConnected || !queryId) {
        // Fallback for offline mode
        handleOfflineProductSelection(selectedProducts);
        return;
      }

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

  const handleOfflineProductSelection = (selectedProducts) => {
    const sampleProducts = [
      { id: 1, name: 'Web Development', description: 'Custom website development', price: 2500.00 },
      { id: 2, name: 'Logo Design', description: 'Professional logo design', price: 500.00 },
      { id: 3, name: 'SEO Optimization', description: 'Search engine optimization', price: 800.00 },
      { id: 4, name: 'Content Writing', description: 'Professional content creation', price: 300.00 },
      { id: 5, name: 'Social Media Setup', description: 'Social media account setup and branding', price: 400.00 }
    ];

    const selectedItems = sampleProducts.filter(p => selectedProducts.includes(p.id));
    
    setTimeout(() => {
      const aiResponse = {
        id: Date.now(),
        text: "⚠️ Offline mode - showing sample invoice preview:",
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'invoice-preview',
        invoiceData: {
          invoiceNumber: `INV-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          dueDate: '',
          billTo: { name: '', company: '', address: '', city: '', state: '', zip: '', email: '' },
          billFrom: { 
            name: 'Your Company Name', 
            company: 'Your Company', 
            address: '123 Business St', 
            city: 'Business City', 
            state: 'State', 
            zip: '12345', 
            email: 'contact@yourcompany.com' 
          },
          items: selectedItems.map(item => ({ ...item, quantity: 1 })),
          taxRate: 8.5,
          notes: 'Thank you for your business!'
        },
        isOffline: true
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
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
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-3 ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <h2 className="text-gray-900 dark:text-white font-semibold">Invoice Assistant</h2>
        </div>
        <div className="flex items-center text-sm">
          <span className={`px-2 py-1 rounded-full text-xs ${
            backendConnected 
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
          }`}>
            {backendConnected ? 'Backend Connected' : 'Backend Offline'}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 1 ? (
          /* Welcome Message */
          <div className="flex flex-col items-center justify-center h-full pb-16">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Invoice Generator</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                AI-powered invoice creation with FastAPI backend
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Simply describe what you need to invoice and I'll find matching products
              </p>
            </div>
            
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-700 p-6 rounded-xl cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
                  onClick={() => setInputText(suggestion)}
                >
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-3 text-xl">→</span>
                    <span className="text-gray-900 dark:text-white font-medium">{suggestion}</span>
                  </div>
                </div>
              ))}
            </div> */}
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
              <div className="flex justify-start mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg mr-8">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1 flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
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
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-end gap-4">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me to create an invoice, select products, or help with billing..."
                className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl py-4 px-6 pr-14 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-600"
                rows="1"
                style={{ minHeight: '60px', maxHeight: '200px' }}
              />
              <button
                type="submit"
                disabled={inputText.trim() === '' || isLoading}
                className="absolute right-3 bottom-3 p-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
          
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
            Invoice Assistant can help you create professional invoices. Start by asking for products or invoice creation.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;