import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';


const RobotIcon3D = (props) => (
    <div className="relative w-20 h-20" {...props}>
        <style>{`
            @keyframes wave-real {
                0%, 100% { transform: rotate(-135deg); }
                10%, 30% { transform: rotate(-120deg); }
                20%, 40% { transform: rotate(-140deg); }
                50% { transform: rotate(-125deg); }
                60% { transform: rotate(-135deg); }
                70% { transform: rotate(-130deg); }
                80% { transform: rotate(-135deg); }
            }
            @keyframes blink {
                0%, 48%, 52%, 100% { transform: scaleY(1); }
                50% { transform: scaleY(0.1); }
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-3px); }
            }
            .robot-container {
                animation: float 4s ease-in-out infinite;
            }
            .wave-arm {
                animation: wave-real 2.5s ease-in-out infinite;
                transform-origin: 75.5px 50px;
            }
            .robot-eye {
                animation: blink 4s infinite;
                transform-origin: center;
            }
        `}</style>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl robot-container">
            <defs>
                {}
                <linearGradient id="ceramicBody" x1="30%" y1="0%" x2="70%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="50%" stopColor="#F3F4F6" />
                    <stop offset="100%" stopColor="#D1D5DB" />
                </linearGradient>

                {}
                <linearGradient id="goldMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FCD34D" />
                    <stop offset="40%" stopColor="#F59E0B" />
                    <stop offset="60%" stopColor="#D97706" />
                    <stop offset="100%" stopColor="#B45309" />
                </linearGradient>

                {}
                <linearGradient id="darkGlass" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#374151" />
                    <stop offset="50%" stopColor="#111827" />
                    <stop offset="100%" stopColor="#000000" />
                </linearGradient>

                {}
                <linearGradient id="gloss" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>

                {}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {}
            <ellipse cx="50" cy="92" rx="25" ry="4" fill="black" opacity="0.2" />

            {}
            <path d="M38 75 L38 85 Q38 88 35 88 L35 88 Q32 88 32 85 L32 75" fill="url(#goldMetal)" stroke="#92400E" strokeWidth="0.5" />
            <path d="M62 75 L62 85 Q62 88 65 88 L65 88 Q68 88 68 85 L68 75" fill="url(#goldMetal)" stroke="#92400E" strokeWidth="0.5" />

            {}
            <rect x="28" y="45" width="44" height="32" rx="10" fill="url(#ceramicBody)" stroke="#9CA3AF" strokeWidth="0.5" />
            {}
            <path d="M32 48 H68 Q74 48 74 54 V60 Q74 50 64 50 H36 Q30 50 30 60 V54 Q30 48 36 48 Z" fill="white" opacity="0.6" />

            {}
            <rect x="38" y="52" width="24" height="18" rx="4" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1" />
            {}
            <circle cx="50" cy="61" r="4" fill="#F59E0B" filter="url(#glow)" />
            <circle cx="50" cy="61" r="2" fill="#FEF3C7" />

            {}
            <rect x="22" y="50" width="5" height="22" rx="2.5" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1" />
            <circle cx="24.5" cy="50" r="3" fill="url(#goldMetal)" stroke="#92400E" strokeWidth="0.5" />
            <circle cx="24.5" cy="72" r="3" fill="url(#goldMetal)" stroke="#92400E" strokeWidth="0.5" />

            {}
            <g className="wave-arm">
                <rect x="73" y="50" width="5" height="22" rx="2.5" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1" />
                <circle cx="75.5" cy="50" r="3" fill="url(#goldMetal)" stroke="#92400E" strokeWidth="0.5" />
                <circle cx="75.5" cy="72" r="3" fill="url(#goldMetal)" stroke="#92400E" strokeWidth="0.5" />
            </g>

            {}
            <g transform="translate(0, -2)">
                {}
                <rect x="42" y="40" width="16" height="8" fill="#374151" />

                {}
                <rect x="25" y="15" width="50" height="32" rx="12" fill="url(#ceramicBody)" stroke="#9CA3AF" strokeWidth="0.5" />

                {}
                <rect x="30" y="20" width="40" height="22" rx="8" fill="url(#darkGlass)" stroke="#1F2937" strokeWidth="1" />

                {}
                <path d="M32 22 H68 Q70 22 70 24 V30 L30 35 V24 Q30 22 32 22 Z" fill="white" opacity="0.1" />

                {}
                <g className="robot-eye">
                    <ellipse cx="40" cy="31" rx="5" ry="7" fill="#F59E0B" filter="url(#glow)" />
                    <ellipse cx="40" cy="31" rx="2" ry="3" fill="#FEF3C7" />

                    <ellipse cx="60" cy="31" rx="5" ry="7" fill="#F59E0B" filter="url(#glow)" />
                    <ellipse cx="60" cy="31" rx="2" ry="3" fill="#FEF3C7" />
                </g>

                {}
                <line x1="50" y1="15" x2="50" y2="8" stroke="#9CA3AF" strokeWidth="2" />
                <circle cx="50" cy="6" r="3" fill="url(#goldMetal)" />
                <circle cx="50" cy="6" r="1.5" fill="#FEF3C7" filter="url(#glow)" className="animate-pulse" />

                {}
                <path d="M35 16 H65 Q73 16 73 24 V28 Q73 18 65 18 H35 Q27 18 27 28 V24 Q27 16 35 16 Z" fill="white" opacity="0.7" />
            </g>
        </svg>
    </div>
);

const PaperPlaneIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
        <path fill="currentColor" d="M16.1 260.2c-22.6 13.6-35.4 38.8-34 64.9 .5 18.7 7.5 36.5 19.1 52.1c11.6 15.6 27.2 28.7 45.4 38.9c18.2 10.2 38.1 16.1 58.7 17.9 1.4 .1 2.7 .3 4.1 .4H424c-1.4-.1-2.7-.3-4.1-.4-20.6-1.8-40.5-7.7-58.7-17.9-18.2-10.2-33.8-23.3-45.4-38.9-11.6-15.6-18.6-33.4-19.1-52.1c-.5-26.1 12.3-51.3 34-64.9l149.2-89.1-149.2-89.1c-22.6-13.6-35.4-38.8-34-64.9 .5-18.7 7.5-36.5 19.1-52.1c11.6-15.6 27.2-28.7 45.4-38.9c18.2-10.2 38.1-16.1 58.7-17.9 1.4-.1 2.7-.3 4.1-.4H72c1.4 .1 2.7 .3 4.1 .4 20.6 1.8 40.5 7.7 58.7 17.9 18.2 10.2 33.8 23.3 45.4 38.9c11.6 15.6 18.6 33.4 19.1 52.1 .5 26.1-12.3 51.3-34 64.9l-149.2 89.1z" />
    </svg>
);

const TimesIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" {...props}>
        <path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
    </svg>
);

const SpinnerIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
        <path fill="currentColor" d="M222.7 32.1c5.2 11.7 1.9 25.5-7.3 33.7l-47.6 42.6c-13.8 12.3-33.1 19.4-53.5 19.4H48c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16h66.3c8.1 0 15.8-3.1 21.6-8.7l54-51.2c5.6-5.3 12.8-8.2 20.2-8.2s14.6 2.9 20.2 8.2l54 51.2c5.6 5.3 12.8 8.2 20.2 8.2H384c8.8 0 16-7.2 16-16v-16c0-8.8-7.2-16-16-16H310.2c-20.4 0-39.7-7.1-53.5-19.4l-47.6-42.6c-9.2-8.2-12.5-22-7.3-33.7s16.7-19.3 29-19.3h83.7c8.8 0 16-7.2 16-16v-16c0-8.8-7.2-16-16-16H250.7c-12.3 0-23.7 6.9-29 19.3zM96 240c0-8.8-7.2-16-16-16s-16 7.2-16 16v16c0 8.8 7.2 16 16 16s16-7.2 16-16v-16zm-16 96c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16s16-7.2 16-16v-16c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16s16-7.2 16-16v-16c0-8.8-7.2-16-16-16zm128 0c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16s16-7.2 16-16v-16c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16s16-7.2 16-16v-16c0-8.8-7.2-16-16-16zm-16-96c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16s16-7.2 16-16v-16c0-8.8-7.2-16-16-16z" />
    </svg>
);






const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm the Tasty Cottage assistant. Ask me anything about our menu!", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const messagesEndRef = useRef(null);
    const CHAT_API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/chat`;

    const tooltipMessages = [
        "Ask a Question!",
        "Need Help?",
        "How can I assist you?"
    ];

    
    useEffect(() => {
        if (!showTooltip || isOpen) return;

        const interval = setInterval(() => {
            setCurrentMessageIndex((prev) => (prev + 1) % tooltipMessages.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [showTooltip, isOpen]);

    
    useEffect(() => {
        if (isOpen) {
            setShowTooltip(false);
        }
    }, [isOpen]);

    const scrollToBottom = useCallback(() => {
        
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, []);

    useEffect(() => {
        
        scrollToBottom();
    }, [messages, isOpen, scrollToBottom]);

    const handleSend = async () => {
        const messageText = input.trim();
        if (!messageText) return;

        const userMessage = { text: messageText, sender: 'user' };

        
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            
            const response = await axios.post(CHAT_API_URL, {
                message: messageText
            });

            let botReply = response.data.reply;

            
            if (response.status === 500 || (response.data.message && response.data.message.includes("Server Error"))) {
                botReply = "I apologize, the restaurant server seems to be down. Please try again in a moment.";
            }

            const botMessage = { text: botReply, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Chat API error:", error);

            
            const isServerError = error.response && error.response.status === 500;
            const serverErrorMsg = error.response?.data?.error;

            const errorMessage = {
                text: isServerError
                    ? `Server Error: ${serverErrorMsg || "The menu database is currently inaccessible."}`
                    : "Sorry, I couldn't connect to the chat service. Please ensure the backend is running at " + CHAT_API_URL,
                sender: 'bot',
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            handleSend();
        }
    };

    const ChatBubble = ({ msg }) => {
        const baseClasses = 'max-w-[80%] p-3 rounded-xl text-sm shadow-md';
        const userClasses = 'bg-[#D1A054] text-white rounded-br-md';
        const botClasses = 'bg-white border border-gray-200 text-gray-800 rounded-bl-md';
        const errorClasses = 'bg-red-100 border border-red-400 text-red-700 rounded-bl-md';

        let finalClasses = baseClasses;
        if (msg.isError) {
            finalClasses = `${baseClasses} ${errorClasses}`;
        } else if (msg.sender === 'user') {
            finalClasses = `${baseClasses} ${userClasses}`;
        } else {
            finalClasses = `${baseClasses} ${botClasses}`;
        }

        return (
            <div
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
                <div className={finalClasses}>
                    {msg.text}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed bottom-5 right-5 z-50 font-['Inter'] antialiased">
            <style>{`
                @keyframes slideInFade {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }
                .tooltip-popup {
                    animation: slideInFade 0.5s ease-out;
                }
                .tooltip-pulse {
                    animation: pulse 2s ease-in-out infinite;
                }
            `}</style>

            {}
            {!isOpen && showTooltip && (
                <div className="absolute bottom-24 right-0 tooltip-popup">
                    <div className="bg-white rounded-lg shadow-xl p-3 pr-8 border-2 border-[#D1A054] relative tooltip-pulse">
                        <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                            {tooltipMessages[currentMessageIndex]}
                        </p>
                        <button
                            onClick={() => setShowTooltip(false)}
                            className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 w-5 h-5 flex items-center justify-center"
                            aria-label="Close tooltip"
                        >
                            <TimesIcon className="w-3 h-3" />
                        </button>
                        {}
                        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r-2 border-b-2 border-[#D1A054] transform rotate-45"></div>
                    </div>
                </div>
            )}

            {}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-transparent p-2 hover:scale-110 transition-all duration-300 flex items-center justify-center"
                    aria-label="Open Chatbot"
                    style={{
                        filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                    }}
                >
                    <RobotIcon3D />
                </button>
            )}

            {}
            {isOpen && (
                <div className="bg-white rounded-xl shadow-2xl w-80 sm:w-96 h-[500px] flex flex-col mb-4 border-t-8 border-[#D1A054] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {}
                    <div className="bg-white p-4 flex justify-between items-center text-gray-800 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <RobotIcon3D />
                            <div>
                                <h3 className="font-extrabold text-lg">Tasty Assistant</h3>
                                <p className="text-xs text-gray-500">Online | Menu Q&A</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 p-2 rounded-full transition-colors"
                            aria-label="Close Chatbot"
                        >
                            <TimesIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                        {messages.map((msg, index) => (
                            <ChatBubble key={index} msg={msg} />
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 p-3 rounded-xl rounded-bl-md shadow-sm">
                                    <SpinnerIcon className="w-4 h-4 animate-spin text-gray-400" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about our menu..."
                                disabled={loading}
                                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#D1A054] focus:ring-1 focus:ring-[#D1A054] disabled:bg-gray-100"
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="bg-[#D1A054] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#b58b49] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                aria-label="Send Message"
                            >
                                <PaperPlaneIcon className="text-base w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;