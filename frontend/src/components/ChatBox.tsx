import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import TypingIndicator from './TypingIndicator';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isNew?: boolean;
}

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Hapus flag isNew setelah animasi selesai
  useEffect(() => {
    if (messages.some(msg => msg.isNew)) {
      const timer = setTimeout(() => {
        setMessages(prev =>
          prev.map(msg => ({ ...msg, isNew: false }))
        );
      }, 500); // 500ms untuk memberi waktu animasi selesai

      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() === '') return;
    setIsTyping(true)
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      isNew: true
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    axios.post('http://localhost:3000/api/generate-from-text', {
      prompt: inputValue,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(function (response) {
        console.log(response.data);
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: response.data.message,
          sender: 'bot',
          timestamp: new Date(),
          isNew: true
        };
        setMessages(prev => [...prev, botResponse]);
      })
      .catch(function (error) {
        console.log(error);
      }).finally(() => {
        setIsTyping(false)
      });


    // Simulasi balasan bot
    // setTimeout(() => {
    //   const botResponse: Message = {
    //     id: (Date.now() + 1).toString(),
    //     text: `Terima kasih atas pesan Anda: "${inputValue}". Ini adalah balasan otomatis dari bot.`,
    //     sender: 'bot',
    //     timestamp: new Date(),
    //     isNew: true
    //   };
    //   setMessages(prev => [...prev, botResponse]);
    // }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chat-container w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto h-[500px] sm:h-[550px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-border">
      {/* Chat Header */}
      <div className="bg-card border-b border-border p-3 sm:p-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Chat Assistant</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Online</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto h-[350px] sm:h-[400px] md:h-[450px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end space-x-2 transition-all duration-300 ${message.isNew ? 'animate-slide-up' : ''
              }`}
          >
            {message.sender === 'bot' && (
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-secondary-foreground" />
              </div>
            )}

            <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} flex-1`}>
              <div className={message.sender === 'user' ? 'chat-message-sent' : 'chat-message-received'}>
                <p className="text-xs sm:text-sm leading-relaxed break-words">{message.text}</p>
              </div>
              <span className="text-xs text-muted-foreground mt-1 px-1">
                {formatTime(message.timestamp)}
              </span>
            </div>

            {message.sender === 'user' && (
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="flex space-x-2 items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ketik pesan Anda..."
            className="chat-input flex-1 text-xs sm:text-sm"
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="rounded-lg bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105 w-8 h-8 sm:w-10 sm:h-10"
            disabled={inputValue.trim() === ''}
          >
            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;