'use client';

import { useState } from 'react';

const Sidebar = () => {
  const [chats, setChats] = useState([
    { id: 1, title: 'Understanding React Hooks', date: 'Yesterday' },
    { id: 2, title: 'Next.js App Router Guide', date: '2 days ago' },
    { id: 3, title: 'Tailwind CSS Best Practices', date: '1 week ago' },
    { id: 4, title: 'API Route Implementation', date: '2 weeks ago' },
    { id: 5, title: 'Deployment Strategies', date: '3 weeks ago' },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewChat = () => {
    const newChat = {
      id: chats.length + 1,
      title: `New Conversation ${chats.length + 1}`,
      date: 'Just now'
    };
    setChats([newChat, ...chats]);
  };

  return (
    <div className={`flex flex-col h-full bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        {!isCollapsed && (
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-md bg-white/10 hover:bg-white/20 transition-colors duration-200 border border-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>New chat</span>
          </button>
        )}
        {isCollapsed && (
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center p-3 rounded-md bg-white/10 hover:bg-white/20 transition-colors duration-200 border border-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Search (only visible when expanded) */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search chat history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Chat History (only visible when expanded) */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Today</h3>
            <div className="mt-2 space-y-1">
              {filteredChats.slice(0, 2).map(chat => (
                <button
                  key={chat.id}
                  className="w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between text-gray-300 hover:bg-gray-800"
                >
                  <span className="truncate flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                    </svg>
                    {chat.title}
                  </span>
                </button>
              ))}
            </div>

            <h3 className="px-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Previous 7 Days</h3>
            <div className="mt-2 space-y-1">
              {filteredChats.slice(2, 5).map(chat => (
                <button
                  key={chat.id}
                  className="w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between text-gray-300 hover:bg-gray-800"
                >
                  <span className="truncate flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                    </svg>
                    {chat.title}
                  </span>
                </button>
              ))}
            </div>

            <h3 className="px-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Previous 30 Days</h3>
            <div className="mt-2 space-y-1">
              {filteredChats.slice(5).map(chat => (
                <button
                  key={chat.id}
                  className="w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between text-gray-300 hover:bg-gray-800"
                >
                  <span className="truncate flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                    </svg>
                    {chat.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">JD</span>
              </div>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-400">Free Account</p>
              </div>
            </div>
            <button 
              onClick={() => setIsCollapsed(true)}
              className="p-1 rounded-md hover:bg-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <button 
              onClick={() => setIsCollapsed(false)}
              className="p-1 rounded-md hover:bg-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">JD</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;