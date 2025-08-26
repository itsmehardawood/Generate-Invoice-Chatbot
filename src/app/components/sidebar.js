'use client';

import { useState } from 'react';

const Sidebar = ({ onClose, isCollapsed = false, onToggleCollapse }) => {
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewChat = () => {
    const newChat = {
      id: chats.length + 1,
      title: `New Invoice ${chats.length + 1}`,
      date: 'Just now',
      type: 'invoice'
    };
    setChats([newChat, ...chats]);
  };

  return (
    <div className={`flex flex-col h-full bg-gray-900 text-white transition-all duration-300 ${
      isCollapsed ? 'w-16 lg:w-20' : 'w-72 sm:w-80 lg:w-64'
    }`}>
      
      {/* App Name */}
      <div className="p-4 border-b text-center border-gray-800">
        {!isCollapsed ? (
          <h1 className="text-xl  font-bold text-green-500 tracking-wide">
            GreenGenius Bot
          </h1>
        ) : (
          <h1 className="text-lg font-bold text-green-500">G</h1>
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {!isCollapsed && (
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 border border-gray-600 text-sm lg:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 lg:h-5 lg:w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>New Invoice</span>
          </button>
        )}
        {isCollapsed && (
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 border border-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 lg:h-5 lg:w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Search (only visible when expanded) */}
      {!isCollapsed && (
        <div className="p-3 lg:p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            />
          </div>
        </div>
      )}

      {/* Chat History (only visible when expanded) */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Today</h3>
            <div className="space-y-1">
              {filteredChats.slice(0, 2).map(chat => (
                <button
                  key={chat.id}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center text-gray-300 hover:bg-gray-800 transition-colors duration-150 group"
                >
                  <div className={`h-2 w-2 lg:h-3 lg:w-3 rounded-full mr-3 flex-shrink-0 ${
                    chat.type === 'invoice' ? 'bg-green-400' : 
                    chat.type === 'estimate' ? 'bg-blue-400' : 'bg-yellow-400'
                  }`}></div>
                  <span className="truncate group-hover:text-white transition-colors">{chat.title}</span>
                </button>
              ))}
            </div>

            <h3 className="px-2 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Previous 7 Days</h3>
            <div className="space-y-1">
              {filteredChats.slice(2, 5).map(chat => (
                <button
                  key={chat.id}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center text-gray-300 hover:bg-gray-800 transition-colors duration-150 group"
                >
                  <div className={`h-2 w-2 lg:h-3 lg:w-3 rounded-full mr-3 flex-shrink-0 ${
                    chat.type === 'invoice' ? 'bg-green-400' : 
                    chat.type === 'estimate' ? 'bg-blue-400' : 'bg-yellow-400'
                  }`}></div>
                  <span className="truncate group-hover:text-white transition-colors">{chat.title}</span>
                </button>
              ))}
            </div>

            <h3 className="px-2 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Previous 30 Days</h3>
            <div className="space-y-1">
              {filteredChats.slice(5).map(chat => (
                <button
                  key={chat.id}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center text-gray-300 hover:bg-gray-800 transition-colors duration-150 group"
                >
                  <div className={`h-2 w-2 lg:h-3 lg:w-3 rounded-full mr-3 flex-shrink-0 ${
                    chat.type === 'invoice' ? 'bg-green-400' : 
                    chat.type === 'estimate' ? 'bg-blue-400' : 'bg-yellow-400'
                  }`}></div>
                  <span className="truncate group-hover:text-white transition-colors">{chat.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 lg:p-4 border-t border-gray-700">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="h-8 w-8 lg:h-9 lg:w-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-semibold">JD</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate text-white">XYZ User</p>
                <p className="text-xs text-gray-400 truncate">User Account</p>
              </div>
            </div>
            <button 
              onClick={onToggleCollapse}
              className="p-1.5 rounded-md hover:bg-gray-800 hidden lg:block transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
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
              <span className="text-white text-sm font-semibold">JD</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
