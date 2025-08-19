'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

function Homepage() {
  const router = useRouter();

  return (
    <div className='h-screen w-full flex flex-col space-y-3 justify-center items-center'>
      <h1 className='text-2xl font-bold'>Hello this is Homepage</h1>
      <button 
        onClick={() => router.push('/chat')} 
        className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
      >
        Start Chat
      </button>
    </div>
  );
}

export default Homepage;
