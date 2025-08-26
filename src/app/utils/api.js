// API utility functions for FastAPI backend integration

const API_BASE_URL = 'https://greengenius.crm-labloid.com';

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
    // console.log('Sending query to backend:', { query });
    
    const response = await fetch(`${API_BASE_URL}/parse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    // console.log('Backend response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      // console.log('Backend error response:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || errorData.message || `API Error: ${response.status}`);
      } catch (parseError) {
        throw new Error(`Backend returned ${response.status}: ${errorText}`);
      }
    }
    
    const result = await response.json();
    // console.log('Backend success response:', result);
    return result;
  } catch (error) {
    console.error('Parse query error:', error);
    throw error;
  }
};

// Select products and create invoice draft
export const selectProducts = async (queryId, selectedProductIds) => {
  try {
    console.log('Sending select request to backend:', { query_id: queryId, selected_product_ids: selectedProductIds });
    
    const response = await fetch(`${API_BASE_URL}/select`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query_id: queryId,
        selected_product_ids: selectedProductIds,
      }),
    });
    
    console.log('Select response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Select error response:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || errorData.message || `API Error: ${response.status}`);
      } catch (parseError) {
        throw new Error(`Backend returned ${response.status}: ${errorText}`);
      }
    }
    
    const result = await response.json();
    console.log('Select success response:', result);
    return result;
  } catch (error) {
    console.error('Select products error:', error);
    throw error;
  }
};

// Create final invoice
export const createInvoice = async (draftId, invoiceDetails = {}) => {
  try {
    console.log('Sending invoice creation request to backend:', { 
      draft_id: draftId, 
      recipient: invoiceDetails.recipient,
      building_site: invoiceDetails.building_site,
      notes: invoiceDetails.notes
    });
    
    const response = await fetch(`${API_BASE_URL}/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        draft_id: draftId,
        recipient: invoiceDetails.recipient,
        building_site: invoiceDetails.building_site,
        notes: invoiceDetails.notes,
      }),
    });
    
    console.log('Invoice creation response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Invoice creation error response:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || errorData.message || `API Error: ${response.status}`);
      } catch (parseError) {
        throw new Error(`Backend returned ${response.status}: ${errorText}`);
      }
    }
    
    const result = await response.json();
    console.log('Invoice creation success response:', result);
    return result;
  } catch (error) {
    console.error('Create invoice error:', error);
    throw error;
  }
};

// Edit invoice with natural language
export const editInvoice = async (invoiceId, editInstruction) => {
  try {
    console.log('Sending invoice edit request to backend:', { 
      invoice_id: invoiceId, 
      edit_instruction: editInstruction
    });
    
    const response = await fetch(`${API_BASE_URL}/edit_invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        invoice_id: invoiceId,
        edit_instruction: editInstruction
      }),
    });
    
    // console.log('Invoice edit response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      // console.log('Invoice edit error response:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || errorData.message || `API Error: ${response.status}`);
      } catch (parseError) {
        throw new Error(`Backend returned ${response.status}: ${errorText}`);
      }
    }
    
    const result = await response.json();
    // console.log('Invoice edit success response:', result);
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
