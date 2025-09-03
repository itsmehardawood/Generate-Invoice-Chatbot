// API utility functions for FastAPI backend integration

const API_BASE_URL = 'https://greengenius.crm-labloid.com';
// const API_BASE_URL = 'http://localhost:8000';

// Authentication helper functions
export const getAuthHeaders = async () => {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  
  const token = localStorage.getItem('access_token');
  
  // TODO: Implement token refresh when backend endpoint is ready
  // if (token && isTokenExpired()) {
  //   try {
  //     token = await refreshAccessToken();
  //   } catch (error) {
  //     console.error('Failed to refresh token:', error);
  //     return { 'Content-Type': 'application/json' };
  //   }
  // }
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('access_token');
};

// Check if token is expired or will expire soon (within 5 minutes)
export const isTokenExpired = () => {
  if (typeof window === 'undefined') return false;
  
  const expiresAt = localStorage.getItem('token_expires_at');
  if (!expiresAt) return false;
  
  const expiry = new Date(expiresAt);
  const now = new Date();
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
  
  return expiry <= fiveMinutesFromNow;
};

// Token refresh functionality
export const refreshAccessToken = async () => {
  if (typeof window === 'undefined') return null;
  
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      // If refresh fails, clear all auth data
      logout();
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    
    // Store new tokens
    localStorage.setItem('access_token', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }
    
    // Calculate and store expiry time (expires_in is in seconds)
    const expiresAt = new Date(Date.now() + (data.expires_in * 1000));
    localStorage.setItem('token_expires_at', expiresAt.toISOString());
    
    return data.access_token;
  } catch (error) {
    console.error('Token refresh error:', error);
    logout();
    throw error;
  }
};

export const logout = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('current_session_id');
  localStorage.removeItem('token_expires_at');
};

// Authentication endpoints
export const signup = async (email, name, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, password }),
    });
    
    const data = await handleApiError(response);
    
    // Store auth data (only in browser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Calculate and store expiry time (expires_in is in seconds)
      if (data.expires_in) {
        const expiresAt = new Date(Date.now() + (data.expires_in * 1000));
        localStorage.setItem('token_expires_at', expiresAt.toISOString());
      }
    }
    
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const signin = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await handleApiError(response);
    
    // Store auth data (only in browser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Calculate and store expiry time (expires_in is in seconds)
      if (data.expires_in) {
        const expiresAt = new Date(Date.now() + (data.expires_in * 1000));
        localStorage.setItem('token_expires_at', expiresAt.toISOString());
      }
    }
    
    return data;
  } catch (error) {
    console.error('Signin error:', error);
    throw error;
  }
};

// Chat session management
export const createChatSession = async (title = 'New Chat') => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/chat/sessions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ title }),
    });
    
    const sessionData = await handleApiError(response);
    
    // Store current session ID (only in browser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('current_session_id', sessionData.id);
    }
    return sessionData;
  } catch (error) {
    console.error('Create session error:', error);
    throw error;
  }
};

export const getUserSessions = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/chat/sessions`, {
      method: 'GET',
      headers,
    });
    
    return await handleApiError(response);
  } catch (error) {
    console.error('Get sessions error:', error);
    throw error;
  }
};

export const getSessionMessages = async (sessionId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/messages`, {
      method: 'GET',
      headers,
    });
    
    const backendMessages = await handleApiError(response);
    
    // Transform backend messages to frontend format
    return transformBackendMessages(backendMessages);
  } catch (error) {
    console.error('Get session messages error:', error);
    throw error;
  }
};

export const deleteSession = async (sessionId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `Failed to delete session: ${response.status}`);
    }
    
    // Clear current session if it's the one being deleted
    if (typeof window !== 'undefined') {
      const currentSessionId = localStorage.getItem('current_session_id');
      if (currentSessionId === sessionId) {
        localStorage.removeItem('current_session_id');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Delete session error:', error);
    throw error;
  }
};

// Utility function to generate chat title from user query
export const generateChatTitle = (query) => {
  const words = query.split(' ').slice(0, 4); // Take first 4 words
  let title = words.join(' ');
  if (title.length > 30) {
    title = title.substring(0, 27) + '...';
  }
  return title || 'New Chat';
};

// Transform backend products to frontend format
export const transformProductsToFrontend = (backendProducts) => {
  if (!Array.isArray(backendProducts)) return [];
  
  return backendProducts.map(product => ({
    id: product.id,
    name: product.tipo || product.name || `Product ${product.id}`, // Ensure name is set from tipo
    code: product.P_code || product.code || '',
    description: product.descrizione_titolo || product.description || `${product.tipo || 'Product'} - Climate Zone ${product.zona_clim || 'N/A'}`,
    fullDescription: product.descrizione || '',
    price: product.totale || product.price || 0,
    installation: product.installaz || product.installation || 0,
    climate_zone: product.zona_clim || product.climate_zone,
    similarity_score: product.similarity_score,
    unit_price: product.totale || product.price || 0, // Add unit_price for invoice preview
    total_price: product.totale || product.price || 0, // Add total_price for invoice preview
    quantity: 1, // Default quantity
    // Backend specific fields
    tipo: product.tipo,
    immagine: product.immagine,
    zona_clim: product.zona_clim,
    totale: product.totale,
    installaz: product.installaz,
    descrizione_titolo: product.descrizione_titolo,
    descrizione: product.descrizione
  }));
};

// Transform backend message format to frontend format
export const transformBackendMessages = (backendMessages) => {
  if (!Array.isArray(backendMessages)) return [];
  
  return backendMessages.map(msg => {
    const transformedMessage = {
      id: msg.id,
      text: msg.content,
      sender: msg.role === 'user' ? 'user' : 'assistant',
      timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Handle different message types based on message_type
    switch (msg.message_type) {
      case 'product_search':
        transformedMessage.type = 'product-selection';
        transformedMessage.products = transformProductsToFrontend(msg.metadata?.products || []);
        transformedMessage.queryId = msg.metadata?.query_id;
        transformedMessage.selectedProducts = []; // This will be populated if we track selections
        break;
        
      case 'invoice_draft':
        transformedMessage.type = 'invoice-preview';
        transformedMessage.invoiceData = {
          total: msg.metadata?.total || 0,
          draftId: msg.metadata?.draft_id,
          products: [], // Backend doesn't provide full product data for drafts
          productCount: msg.metadata?.products, // Just the count
          // Add basic structure expected by the frontend
          invoiceNumber: msg.metadata?.draft_id || `DRAFT-${Date.now()}`,
          date: new Date(msg.created_at).toISOString().split('T')[0],
          dueDate: '',
          billTo: { name: '', company: '', address: '', city: '', state: '', zip: '', email: '' },
          billFrom: { 
            name: 'GreenGenius Energy', 
            company: 'GreenGenius Energy Solutions', 
            address: '123 Green Street', 
            city: 'Energy City', 
            state: 'EC', 
            zip: '12345', 
            email: 'contact@greengenius.com' 
          },
          items: [], // No detailed items available from backend
          taxRate: 8.5,
          notes: `Invoice draft with ${msg.metadata?.products || 0} products. Total: €${(msg.metadata?.total || 0).toFixed(2)}`
        };
        transformedMessage.draftId = msg.metadata?.draft_id;
        transformedMessage.showTotal = true; // Flag to show total prominently
        break;
        
      case 'invoice_created':
        transformedMessage.type = 'invoice-card';
        transformedMessage.invoiceData = {
          id: msg.metadata?.invoice_id,
          total: msg.metadata?.total || 0,
          // Add basic structure for created invoices
          invoiceNumber: `INV-${msg.metadata?.invoice_id}`,
          date: new Date(msg.created_at).toISOString().split('T')[0],
          status: 'created',
          products: [], // Backend doesn't provide detailed product data
          notes: `Invoice created successfully. Total: €${(msg.metadata?.total || 0).toFixed(2)}`
        };
        transformedMessage.invoiceId = msg.metadata?.invoice_id;
        transformedMessage.invoiceStatus = 'created';
        transformedMessage.createdAt = msg.created_at;
        transformedMessage.showTotal = true; // Flag to show total prominently
        break;
        
      case 'text':
      default:
        // Regular text message, no additional transformation needed
        break;
    }

    return transformedMessage;
  });
};


// Helper function to handle API errors
const handleApiError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // Handle specific backend error messages
    if (errorData.detail && errorData.detail.includes('Could not extract any items')) {
      throw new Error('Could not extract any items from the query. Please be more specific about the products you need.');
    }
    throw new Error(errorData.detail || errorData.message || `API Error: ${response.status}`);
  }
  return response.json();
};

// Parse user query and get matched products
export const parseQuery = async (query) => {
  try {
    const currentSessionId = typeof window !== 'undefined' ? localStorage.getItem('current_session_id') : null;
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/parse`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        query,
        ...(currentSessionId && { session_id: currentSessionId })
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || errorData.message || `API Error: ${response.status}`);
      } catch (parseError) {
        throw new Error(`Backend returned ${response.status}: ${errorText}`);
      }
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Parse query error:', error);
    throw error;
  }
};

// Select products and create invoice draft
export const selectProducts = async (queryId, selectedProductIds) => {
  try {
    const currentSessionId = typeof window !== 'undefined' ? localStorage.getItem('current_session_id') : null;
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/select`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query_id: queryId,
        selected_product_ids: selectedProductIds,
        ...(currentSessionId && { session_id: currentSessionId })
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || errorData.message || `API Error: ${response.status}`);
      } catch (parseError) {
        throw new Error(`Backend returned ${response.status}: ${errorText}`);
      }
    }
    
    const result = await response.json();
    
    // Transform product data if available in the response
    if (result.invoice_data && Array.isArray(result.invoice_data.products)) {
      // Transform products to ensure they have the expected frontend fields
      result.invoice_data.products = result.invoice_data.products.map(product => ({
        ...product,
        name: product.tipo || product.name || `Product ${product.id}`,
        description: product.descrizione_titolo || product.description,
        climate_zone: product.zona_clim || product.climate_zone,
        unit_price: product.totale || product.price || 0,
        total_price: (product.quantity || 1) * (product.totale || product.price || 0),
      }));
    }
    
    return result;
  } catch (error) {
    console.error('Select products error:', error);
    throw error;
  }
};

// Create final invoice
export const createInvoice = async (draftId, invoiceDetails = {}) => {
  try {
    const currentSessionId = typeof window !== 'undefined' ? localStorage.getItem('current_session_id') : null;
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/invoices`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        draft_id: draftId,
        recipient: invoiceDetails.recipient,
        building_site: invoiceDetails.building_site,
        notes: invoiceDetails.notes,
        ...(currentSessionId && { session_id: currentSessionId })
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || errorData.message || `API Error: ${response.status}`);
      } catch (parseError) {
        throw new Error(`Backend returned ${response.status}: ${errorText}`);
      }
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Create invoice error:', error);
    throw error;
  }
};

// Edit invoice with natural language
export const editInvoice = async (invoiceId, editInstruction) => {
  try {
    const currentSessionId = typeof window !== 'undefined' ? localStorage.getItem('current_session_id') : null;
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/edit_invoice`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        invoice_id: invoiceId,
        edit_instruction: editInstruction,
        ...(currentSessionId && { session_id: currentSessionId })
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || errorData.message || `API Error: ${response.status}`);
      } catch (parseError) {
        throw new Error(`Backend returned ${response.status}: ${errorText}`);
      }
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Edit invoice error:', error);
    throw error;
  }
};

// Check if backend is available
export const checkBackendHealth = async () => {
  try {
    // First try a simple GET request to the root or health endpoint
    const healthResponse = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
    });
    
    if (healthResponse.ok) {
      return true;
    }
    
    // If no dedicated health endpoint, try the parse endpoint with a simple query
    const response = await fetch(`${API_BASE_URL}/parse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: 'test PDC unit' }),
    });
    
    // Check if the response is successful OR if it's a valid 400 with expected error structure
    if (response.ok) {
      return true;
    }
    
    // If it's a 400, check if it's our expected error format (backend is working but query failed)
    if (response.status === 400) {
      try {
        const errorData = await response.json();
        // If we get a structured error response, the backend is working
        if (errorData.detail) {
          return true;
        }
      } catch (e) {
        // If we can't parse the error, backend might be down
        return false;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

// Initialize authentication state and set up token refresh
export const initializeAuth = () => {
  if (typeof window === 'undefined') return;

  // Check if we have a token and if it's expired
  const token = localStorage.getItem('access_token');
  if (token && isTokenExpired()) {
    // Try to refresh the token immediately
    refreshAccessToken().catch(() => {
      // If refresh fails, we'll handle it when the user tries to make API calls
      console.log('Token refresh failed during initialization');
    });
  }

  // Set up periodic token refresh (every 30 minutes)
  const refreshInterval = setInterval(async () => {
    if (!isAuthenticated()) {
      clearInterval(refreshInterval);
      return;
    }

    if (isTokenExpired()) {
      try {
        await refreshAccessToken();
        console.log('Token refreshed automatically');
      } catch (error) {
        console.error('Automatic token refresh failed:', error);
        clearInterval(refreshInterval);
      }
    }
  }, 30 * 60 * 1000); // 30 minutes

  // Return cleanup function
  return () => {
    clearInterval(refreshInterval);
  };
};
