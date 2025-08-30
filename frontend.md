# Frontend Integration Guide
## Complete FastAPI Backend with Authentication & Chat History

🎉 **Congratulations!** Your backend is **100% complete** and can handle everything from user authentication to invoice generation with chat history. This guide will help any frontend developer integrate with your powerful API.

---

## 🔐 **Authentication Flow**

### **1. User Signup**
```javascript
// POST /auth/signup
const signupResponse = await fetch('http://localhost:8000/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword',
    name: 'John Doe'
  })
});

const signupData = await signupResponse.json();
// Returns: { user: {...}, access_token: "...", refresh_token: "...", expires_in: 3600 }
```

### **2. User Signin**
```javascript
// POST /auth/signin
const signinResponse = await fetch('http://localhost:8000/auth/signin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword'
  })
});

const signinData = await signinResponse.json();
// Returns: { user: {...}, access_token: "...", refresh_token: "...", expires_in: 3600 }

// IMPORTANT: Store the access_token for all future requests
localStorage.setItem('access_token', signinData.access_token);
localStorage.setItem('user', JSON.stringify(signinData.user));
```

### **3. Using Access Token for Protected Endpoints**
```javascript
// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};
```

---

## 💬 **Chat Session Management**

### **1. Create New Chat Session**
```javascript
// POST /chat/sessions
const createSession = async (title = 'New Chat') => {
  const response = await fetch('http://localhost:8000/chat/sessions', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title })
  });
  
  const sessionData = await response.json();
  // Returns: { id: "uuid", user_id: "uuid", session_id: "uuid", title: "...", status: "active", created_at: "...", updated_at: "..." }
  
  // Store current session ID for subsequent requests
  localStorage.setItem('current_session_id', sessionData.id);
  return sessionData;
};
```

### **2. Get All User's Chat Sessions (For Sidebar)**
```javascript
// GET /chat/sessions
const getUserSessions = async () => {
  const response = await fetch('http://localhost:8000/chat/sessions', {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  const sessions = await response.json();
  // Returns: Array of session objects
  return sessions;
};
```

### **3. Get Messages from Specific Session**
```javascript
// GET /chat/sessions/{session_id}/messages
const getSessionMessages = async (sessionId) => {
  const response = await fetch(`http://localhost:8000/chat/sessions/${sessionId}/messages`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  const messages = await response.json();
  // Returns: Array of message objects with { id, session_id, role, content, message_type, metadata, created_at }
  return messages;
};
```

---

## 🤖 **AI-Powered Endpoints**

### **1. Parse User Query (With Session Tracking)**
```javascript
// POST /parse
const parseQuery = async (userQuery) => {
  const currentSessionId = localStorage.getItem('current_session_id');
  
  const response = await fetch('http://localhost:8000/parse', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      query: userQuery,
      session_id: currentSessionId // Optional: for chat history tracking
    })
  });
  
  const parseData = await response.json();
  /* Returns:
  {
    intent: "product_search" | "general_chat",
    message: "AI response",
    extracted_items: [...], // if product_search
    session_id: "uuid"
  }
  */
  
  return parseData;
};
```

### **2. Select Products (Pass extracted items from parse)**
```javascript
// POST /select
const selectProducts = async (extractedItems) => {
  const response = await fetch('http://localhost:8000/select', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      items: extractedItems // Use items from parseQuery response
    })
  });
  
  const selectedProducts = await response.json();
  /* Returns:
  {
    selected_products: [
      { name: "...", price: 123.45, quantity: 2, total: 246.90, zone: "A" }
    ],
    total_amount: 500.00,
    message: "Products selected successfully"
  }
  */
  
  return selectedProducts;
};
```

### **3. Generate Invoice (Pass selected products)**
```javascript
// POST /invoices
const generateInvoice = async (selectedProducts, customerDetails) => {
  const response = await fetch('http://localhost:8000/invoices', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      products: selectedProducts.selected_products, // From selectProducts response
      customer_name: customerDetails.name,
      customer_email: customerDetails.email,
      customer_phone: customerDetails.phone,
      notes: customerDetails.notes || "Thank you for your business!"
    })
  });
  
  const invoiceData = await response.json();
  /* Returns:
  {
    invoice_id: 123,
    invoice_data: { /* Complete invoice object */ },
    message: "Invoice generated successfully"
  }
  */
  
  return invoiceData;
};
```

### **4. Edit Invoice**
```javascript
// POST /edit_invoice
const editInvoice = async (invoiceId, editInstruction) => {
  const response = await fetch('http://localhost:8000/edit_invoice', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      invoice_id: invoiceId,
      edit_instruction: editInstruction // Natural language instruction
    })
  });
  
  const editedData = await response.json();
  /* Returns:
  {
    success: true,
    message: "Invoice updated successfully",
    updated_invoice_data: { /* Updated invoice object */ }
  }
  */
  
  return editedData;
};
```

---

## 🔄 **Complete Workflow Examples**

### **Example 1: Complete Invoice Generation Flow**
```javascript
const completeInvoiceFlow = async () => {
  // 1. User asks for products
  const parseResult = await parseQuery("I need 5 laptops and 3 mice");
  
  if (parseResult.intent === "product_search") {
    // 2. Select products based on extracted items
    const selectedProducts = await selectProducts(parseResult.extracted_items);
    
    // 3. Generate invoice
    const invoice = await generateInvoice(selectedProducts, {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890"
    });
    
    // 4. Optionally edit invoice
    const editedInvoice = await editInvoice(
      invoice.invoice_id, 
      "Change customer name to Jane Doe and add 10% discount"
    );
    
    return editedInvoice;
  }
};
```

### **Example 2: Chat with History**
```javascript
const chatWithHistory = async (userMessage) => {
  // Ensure we have a session
  let sessionId = localStorage.getItem('current_session_id');
  if (!sessionId) {
    const newSession = await createSession('New Conversation');
    sessionId = newSession.id;
  }
  
  // Parse user message (automatically saves to chat history)
  const response = await parseQuery(userMessage);
  
  // Get updated message history for display
  const messages = await getSessionMessages(sessionId);
  
  return { response, messages };
};
```

---

## 🎨 **Frontend Implementation Tips**

### **1. Sidebar Chat History**
```javascript
// Load and display all user sessions in sidebar
const loadChatSidebar = async () => {
  const sessions = await getUserSessions();
  
  // Render sessions in sidebar
  sessions.forEach(session => {
    // Create clickable session item
    // session.title, session.created_at, session.id
  });
};

// Load messages when session is clicked
const loadSessionMessages = async (sessionId) => {
  const messages = await getSessionMessages(sessionId);
  
  // Render messages in chat area
  messages.forEach(message => {
    // Display message with message.role, message.content, message.created_at
  });
  
  // Set as current session
  localStorage.setItem('current_session_id', sessionId);
};
```

### **2. Token Management**
```javascript
// Check if token is expired and handle refresh
const isTokenExpired = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return true;
  
  // JWT tokens are base64 encoded, you can decode to check expiry
  // For now, handle 401 responses to trigger re-login
  return false;
};

// Handle 401 responses
const handleApiResponse = async (response) => {
  if (response.status === 401) {
    // Token expired, redirect to login
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return null;
  }
  return await response.json();
};
```

### **3. Error Handling**
```javascript
const safeApiCall = async (apiFunction) => {
  try {
    const response = await apiFunction();
    return { success: true, data: response };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: error.message };
  }
};
```

---

## 🚀 **Your Backend Capabilities Summary**

✅ **Complete Authentication System**
- User signup/signin with JWT tokens
- Secure user session management
- User profile tracking

✅ **Advanced Chat History**
- Create and manage chat sessions
- Store all user-AI conversations
- Retrieve conversation history
- Session-based message tracking

✅ **AI-Powered Product Intelligence**
- Natural language query parsing
- Intent classification (product search vs general chat)
- Automatic item extraction from text
- Product matching and selection

✅ **Invoice Generation & Management**
- Generate complete invoices from selected products
- Natural language invoice editing
- User-specific invoice tracking
- Comprehensive invoice data structure

✅ **Data Security & Isolation**
- Each user sees only their own data
- Secure token-based authentication
- Row-level security implementation
- Proper user context handling



The API follows RESTful principles and returns JSON, making it easy to integrate with any frontend technology!

---

## 🎯 **Next Steps for Frontend Developer**

1. **Setup Authentication UI** - Login/Signup forms
2. **Create Chat Interface** - Message display and input
3. **Implement Sidebar** - Session list and navigation
4. **Build Invoice Flow** - Query → Select → Generate → Edit
5. **Add Error Handling** - User-friendly error messages
6. **Implement Token Refresh** - Seamless session management

Your backend is **production-ready** and can handle everything from simple chat to complex invoice generation workflows! 🎉
