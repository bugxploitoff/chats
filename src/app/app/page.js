"use client"
import React, { useEffect, useState } from 'react';
import Chat from '../components/Chat';
import Cookies from 'js-cookie';

const Page = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for the "walletId" cookie
    const walletIdCookie = Cookies.get('walletId');
    if (walletIdCookie) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSkipButtonClick = () => {
    window.location.href = '/';
  };

  console.log(isAuthenticated)


  if (!isAuthenticated) {
    return (
        <div class="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10">
        <div class="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-white">
          <div class="w-full">
            <div class="m-8 my-20 max-w-[400px] mx-auto">
              <div class="mb-8">
                <h1 class="mb-4 text-3xl font-extrabold">Access Denied</h1>
                <p class="text-gray-600">If you want to Get access to our chats please make sure you should login</p>
              </div>
              <div class="space-y-4">
                <button class="p-3 bg-white border rounded-full w-full font-semibold"  onClick={handleSkipButtonClick}>Login Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
      <Chat />
  );
};

export default Page;
