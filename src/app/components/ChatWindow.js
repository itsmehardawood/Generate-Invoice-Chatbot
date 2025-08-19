'use client';

import { useState, useRef, useEffect } from 'react';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I assist you today?", sender: "ai", timestamp: "10:30 AM" },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newUserMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = [
        "I understand your question. Let me think about that...",
        "That's an interesting point. Here's what I can tell you...",
        "Based on my knowledge, I would suggest...",
        "I've analyzed your query and here's my response..."
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const newAIMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, newAIMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const suggestions = [
    "What is React?",
    "Explain Next.js features",
    "How to use Tailwind CSS?",
    "Best practices for web development"
  ];

  return (
    <div className="flex flex-col h-full bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center">
        <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
        <h2 className="text-white font-semibold">ChatGPT</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 1 ? (
          /* Welcome Message */
          <div className="flex flex-col items-center justify-center h-full pb-16">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-white mb-2">ChatGPT</h1>
              <p className="text-gray-400">How can I help you today?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl w-full">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                  onClick={() => setInputText(suggestion)}
                >
                  <div className="flex items-start">
                    <span className="text-white mr-2">→</span>
                    <span className="text-white">{suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3/4 rounded-lg p-4 ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'}`}>
                  <div className="flex items-start">
                    {message.sender === 'ai' && (
                      <div className="mr-3 mt-1 flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">AI</span>
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="font-semibold mr-2">
                          {message.sender === 'user' ? 'You' : 'ChatGPT'}
                        </span>
                        <span className="text-xs text-gray-400">{message.timestamp}</span>
                      </div>
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="ml-3 mt-1 flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">You</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-3/4 rounded-lg p-4 bg-gray-700 text-white">
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
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-end">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message ChatGPT..."
              className="w-full bg-gray-700 text-white rounded-lg py-3 px-4 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="1"
              style={{ minHeight: '60px', maxHeight: '200px' }}
            />
            <button
              type="submit"
              disabled={inputText.trim() === '' || isLoading}
              className="absolute right-2 bottom-2 p-2 rounded-md bg-blue-600 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </form>
        
        <div className="mt-2 text-xs text-gray-400 text-center">
          ChatGPT can make mistakes. Consider checking important information.
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;