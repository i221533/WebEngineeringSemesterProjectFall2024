import React, { useState, useRef, useEffect, Suspense } from 'react';
import { MessageCircle, Send, X, User, Bot, Paperclip, Smile } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

// Update this with actual import for Gemini or AI model
// import { geminiAPI } from './api'; // or any specific API call for Gemini or similar AI service

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatbotRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;
  
    setMessages([...messages, { text: inputMessage, isUser: true }]);
    setInputMessage('');
    setIsTyping(true);
  
    try {
      // API call to the backend
      const response = await fetch('http://localhost:5001/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const botMessage = data?.response || "Thank you for your message. I'm processing your request.";
        setMessages(prevMessages => [...prevMessages, { text: botMessage, isUser: false }]);
      } else {
        // Handle error if the response is not okay
        setMessages(prevMessages => [...prevMessages, { text: "Sorry, there was an error processing your request.", isUser: false }]);
      }
  
    } catch (error) {
      setIsTyping(false);
      setMessages(prevMessages => [...prevMessages, { text: "Sorry, I encountered an error while processing your request.", isUser: false }]);
    } finally {
      setIsTyping(false);
    }
  };
  

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        setMessages([...messages, { text: `File uploaded: ${file.name}`, isUser: true, isFile: true, fileContent }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setInputMessage(prevInput => prevInput.length < 500 ? prevInput + emoji.native : prevInput);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div ref={chatbotRef}>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 z-50 flex items-center justify-center ${isOpen ? 'scale-0' : 'scale-100'} chatbot-button`}
        aria-label="Open chat"
      >
        <MessageCircle size={28} />
        <span className="ml-2 font-semibold">Chat with us</span>
      </button>
      <div className={`fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden transition-all duration-300 ${isOpen ? 'chatbot-window open' : 'chatbot-window closed'}`}>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Bot size={24} className="mr-2" />
            <h2 className="text-xl font-bold">AI Assistant</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 focus:outline-none transition-colors duration-300">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 chatbot-messages bg-opacity-50 bg-gradient-to-b from-white to-gray-100">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} message-animation`}
            >
              {!message.isUser && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mr-2 shadow-md">
                  <Bot size={20} className="text-white" />
                </div>
              )}
              <div
                className={`max-w-[75%] p-3 rounded-lg shadow-md ${message.isUser ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-white text-gray-800'} ${message.isFile ? 'bg-green-100 text-green-800' : ''}`}
              >
                {message.text}
                {message.isFile && message.fileContent && (
                  <img src={message.fileContent} alt="Uploaded file" className="mt-2 max-w-full h-auto rounded-md" />
                )}
              </div>
              {message.isUser && (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center ml-2 shadow-md">
                  <User size={20} className="text-gray-600" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 p-3 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex flex-col pt-4">
            <div className="flex mb-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value.slice(0, 500))}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-r-lg hover:from-indigo-700 hover:to-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Send size={20} />
              </button>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">{inputMessage.length}/500 characters</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <button
                type="button"
                onClick={handleImageUpload}
                className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
              >
                <Paperclip size={20} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
              >
                <Smile size={20} />
              </button>
            </div>
          </form>
          {showEmojiPicker && (
            <div className="absolute bottom-20 right-0 emoji-picker">
              <Suspense fallback={<div>Loading...</div>}>
                <Picker data={data} onEmojiSelect={handleEmojiSelect} />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
