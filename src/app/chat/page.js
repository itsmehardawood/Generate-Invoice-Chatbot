'use client'
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/sidebar";


export default function ChatLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ChatWindow />
      </div>
    </div>
  );
}