"use client";
import { useState } from "react";

const BubbleChatbot = () => {
  const [displayChat, setDisplayChat] = useState(false);
  return (
    <div>
      {!displayChat && (
        <div className="fixed bottom-5 right-3">
          <div
            onClick={() => setDisplayChat(true)}
            className="bg-primary text-white rounded-xl px-2 pt-2"
          >
            <span className="material-symbols-outlined">chat</span>
          </div>
        </div>
      )}
      {displayChat && (
        <div
          onClick={() => setDisplayChat(false)}
          className="h-1/2 lg:w-1/3 md:w-1/2 w-2/3 bg-white shadow-3xl rounded-md z-20 fixed bottom-0 right-0"
        >
          <div>x</div>
        </div>
      )}
    </div>
  );
};

export default BubbleChatbot;
