'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function Homepage() {
  const router = useRouter();

  return (
    <div className='min-h-screen w-full flex flex-col justify-center items-center bg-slate-900 px-4 py-8'>
      <div className="max-w-lg w-full mx-auto text-center">
        <div className="mb-6 sm:mb-8">
          <div className="mx-auto rounded-full flex items-center justify-center mb-4 ">
            <Image src="/images/greengenius_logo.png" alt="GreenGenius Logo" width={400} height={400} style={{ objectFit: 'contain' }} />
          </div>
          <p className='text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-2 font-medium'>Your AI-powered invoice assistant</p>
          <p className='text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 px-2'>Create professional invoices, get product recommendations, and streamline your business with GreenGenius AI.</p>
        </div>
        <div className="space-y-6">
          <button 
            onClick={() => router.push('/chat')} 
            className='w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-blue-600 transition-colors duration-200 font-semibold text-lg shadow-lg hover:shadow-xl active:scale-95'
          >
            Start Creating Invoices
          </button>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-8">
            <div className="text-center p-3">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">500+</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-tight">Invoices Created</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">Fast</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-tight">AI-Powered</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Easy</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-tight">Simple Setup</div>
            </div>
          </div>
        </div>
        <footer className="mt-10 text-center text-xs text-gray-400 dark:text-gray-500">
          &copy; {new Date().getFullYear()} GreenGenius Energy Solutions
        </footer>
      </div>
    </div>
  );
}

export default Homepage;
