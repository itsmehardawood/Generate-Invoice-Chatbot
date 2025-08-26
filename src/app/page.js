'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

function Homepage() {
  const router = useRouter();

  return (
    <div className='min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8'>
      <div className="max-w-lg w-full mx-auto text-center">
        <div className="mb-6 sm:mb-8">
          <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2'>Invoice Generator</h1>
          <p className='text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 px-2'>
            Create professional invoices with our AI-powered assistant
          </p>
        </div>
        
        <div className="space-y-6">
          <button 
            onClick={() => router.push('/chat')} 
            className='w-full bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl active:scale-95'
          >
            Start Creating Invoices
          </button>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 sm:mt-8">
            <div className="text-center p-2 sm:p-3">
              <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">500+</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-tight">Invoices Created</div>
            </div>
            <div className="text-center p-2 sm:p-3">
              <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">Fast</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-tight">AI-Powered</div>
            </div>
            <div className="text-center p-2 sm:p-3">
              <div className="text-lg sm:text-2xl font-bold text-purple-600 dark:text-purple-400">Easy</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-tight">Simple Setup</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
