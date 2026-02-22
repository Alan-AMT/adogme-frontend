"use client";
import { useState } from "react";

const BubbleChatbot = () => {
  const [displayChat, setDisplayChat] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [inputAmountRows, setInputAmountRows] = useState(1);
  const [isColorBorder, setIsColorBorder] = useState(true);

  const handleInputChange = (event: any) => {
    const value = event.target.value;
    setInputQuery(value);
    const MAX_COUNT = 8;
    // Split the text by newline characters and get the length of the resulting array
    const lines = value.split(/\r|\r\n|\n/);
    // Add 1 to the length to account for content that doesn't end with a newline
    const lineBreakCount = lines.length;
    // const hola = value.length
    const count = lineBreakCount + Math.floor(value.length / 50);
    // const count = lineBreakCount;
    if (count <= MAX_COUNT) {
      setInputAmountRows(count);
    }
    // setInputAmountRows(count);
  };

  return (
    <div
      onScroll={(e) => {
        e.preventDefault();
      }}
    >
      <div className="fixed bottom-5 right-4">
        <div
          onClick={() => setDisplayChat(!displayChat)}
          className="bg-primary text-white rounded-xl px-2 pt-2"
        >
          {displayChat ? (
            <span className="material-symbols-outlined">
              keyboard_arrow_down
            </span>
          ) : (
            <span className="material-symbols-outlined">chat</span>
          )}
        </div>
      </div>
      {displayChat && (
        <div
          tabIndex={0}
          className="h-2/2 md:h-15/20 lg:w-1/3 w-2/2 md:w-1/2 bg-white shadow-lg rounded-3xl z-40 fixed bottom-0 md:bottom-17 md:right-4"
        >
          <div className="w-full h-full flex flex-col px-4">
            <button
              onClick={() => setDisplayChat(false)}
              className="absolute top-2 right-2 opacity-50 p-2"
            >
              <span className="material-symbols-outlined">close_small</span>
            </button>
            <div className="border-b border-gray-200">
              <h1 className="text-xl font-medium text-center py-3">
                aDOGme asistente
              </h1>
            </div>
            <div className="grow overflow-y-scroll overscroll-contain mt-2">
              <div className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                    />
                  </div>
                </div>
                <div className="chat-bubble">
                  Hola! Soy tu asistente en aDOGme. En qué te ayudo hoy?
                </div>
              </div>
              <div className="chat chat-end mt-3">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                    />
                  </div>
                </div>
                <div className="chat-bubble bg-primary text-white opacity-85">
                  Cómo puedo adoptar un perro?
                </div>
              </div>
            </div>
            <div className="mb-4">
              <textarea
                autoFocus={true}
                onFocus={() => setIsColorBorder(true)}
                onBlur={() => setIsColorBorder(false)}
                rows={inputAmountRows}
                className="textarea w-full rounded-xl min-h-5 focus:outline-none focus:ring-0 rounded-b-none border-b-0 resize-none pb-0"
                placeholder="Haz una pregunta..."
                value={inputQuery}
                onChange={handleInputChange}
              ></textarea>
              <div
                className={`flex bg-white justify-end rounded-b-xl ${isColorBorder ? "border-black" : "border-gray-300"} outline-none border-b border-x py-1 px-2`}
              >
                <div className="bg-primary text-white rounded-3xl pl-1.5 pr-1 pt-1.5">
                  <span className="material-symbols-outlined">send</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BubbleChatbot;
