import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  ArrowLeft, 
  Send, 
  Smile, 
  Paperclip, 
  Phone, 
  Video,
  MoreVertical,
  Circle,
  MessageCircle,
  Clock,
  Check,
  CheckCheck,
  Camera,
  Mic
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  message: string;
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  agent?: {
    name: string;
    avatar?: string;
  };
}

interface ChatSupportViewProps {
  onBack: () => void;
}

export function ChatSupportView({ onBack }: ChatSupportViewProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      message: 'Anda telah terhubung dengan tim support EcoBank. Kami siap membantu Anda!',
      timestamp: new Date(Date.now() - 5 * 60000)
    },
    {
      id: '2',
      type: 'agent',
      message: 'Halo! Selamat datang di EcoBank Support. Saya Sarah, customer service yang akan membantu Anda hari ini. Ada yang bisa saya bantu? 😊',
      timestamp: new Date(Date.now() - 4 * 60000),
      agent: {
        name: 'Sarah',
        avatar: 'S'
      }
    },
    {
      id: '3',
      type: 'agent',
      message: 'Beberapa topik yang sering ditanyakan:\n• Cara setor sampah\n• Penarikan saldo\n• Masalah akun\n• Informasi lokasi bank sampah',
      timestamp: new Date(Date.now() - 3 * 60000),
      agent: {
        name: 'Sarah',
        avatar: 'S'
      }
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'online' | 'typing' | 'away'>('online');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = () => {
    try {
      if (!user?.id) return;

      const chatsJson = localStorage.getItem(`ecobank_chats_${user.id}`);
      if (chatsJson) {
        const chats = JSON.parse(chatsJson);
        const formattedMessages = chats.map((chat: any, index: number) => ({
          id: index.toString(),
          type: chat.type || 'agent',
          message: chat.message,
          timestamp: new Date(chat.timestamp),
          status: 'read',
          agent: chat.type === 'user' ? undefined : {
            name: 'Admin Support',
            avatar: 'AS'
          }
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !user?.id) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Save user message to localStorage
    try {
      const chatsJson = localStorage.getItem(`ecobank_chats_${user.id}`);
      const chats = chatsJson ? JSON.parse(chatsJson) : [];
      chats.push({
        type: 'user',
        message: inputMessage,
        timestamp: new Date().toISOString(),
        read: false
      });
      localStorage.setItem(`ecobank_chats_${user.id}`, JSON.stringify(chats));
    } catch (error) {
      console.error("Error saving message:", error);
    }

    // Simulate agent response
    setTimeout(() => {
      setAgentStatus('typing');
    }, 500);

    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        message: generateAgentResponse(inputMessage),
        timestamp: new Date(),
        agent: {
          name: 'Admin Support',
          avatar: 'AS'
        }
      };

      setMessages(prev => [...prev, agentResponse]);
      setIsTyping(false);
      setAgentStatus('online');
      
      // Save agent message to localStorage
      try {
        const chatsJson = localStorage.getItem(`ecobank_chats_${user.id}`);
        const chats = chatsJson ? JSON.parse(chatsJson) : [];
        chats.push({
          type: 'admin',
          message: agentResponse.message,
          timestamp: new Date().toISOString(),
          read: true
        });
        localStorage.setItem(`ecobank_chats_${user.id}`, JSON.stringify(chats));
      } catch (error) {
        console.error("Error saving agent message:", error);
      }
      
      // Mark user message as read
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'read' } : msg
      ));
    }, 2000);
  };

  const generateAgentResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('setor') || input.includes('deposit')) {
      return 'Untuk menyetor sampah, Anda bisa:\n\n1. Gunakan fitur "Setor Sampah" di beranda\n2. Scan QR code di lokasi bank sampah\n3. Atau hubungi koordinator wilayah Anda\n\nApakah ada hal lain yang ingin ditanyakan? 😊';
    }
    
    if (input.includes('tarik') || input.includes('saldo') || input.includes('cashout')) {
      return 'Untuk penarikan saldo:\n\n1. Minimal penarikan Rp 10.000\n2. Proses 1-3 hari kerja\n3. Bisa ke rekening bank atau e-wallet\n\nSaldo Anda saat ini cukup untuk ditarik. Mau saya bantu proses penarikannya?';
    }
    
    if (input.includes('akun') || input.includes('password') || input.includes('login')) {
      return 'Untuk masalah akun, saya bisa bantu:\n\n• Reset password\n• Update profil\n• Verifikasi identitas\n• Riwayat transaksi\n\nBisa dijelaskan masalah spesifiknya?';
    }
    
    if (input.includes('lokasi') || input.includes('alamat') || input.includes('tempat')) {
      return 'Bank sampah terdekat dari lokasi Anda:\n\n📍 UNIS Tangerang - Jl. Perintis Kemerdekaan\n📍 Bank Sampah Bersih - Jl. Sudirman\n📍 EcoCenter Serpong - Jl. Raya Serpong\n\nMau saya kirimkan lokasi detailnya di Google Maps?';
    }
    
    if (input.includes('halo') || input.includes('hai') || input.includes('hello')) {
      return 'Halo juga! Senang bisa membantu Anda hari ini. Ada pertanyaan tentang EcoBank yang bisa saya jawab? 😊';
    }
    
    if (input.includes('terima kasih') || input.includes('thanks')) {
      return 'Sama-sama! Senang bisa membantu. Jika ada pertanyaan lain jangan ragu untuk chat lagi ya! 🙏';
    }
    
    return 'Terima kasih atas pertanyaannya! Saya akan cek informasi yang Anda butuhkan. Untuk respon yang lebih cepat, Anda juga bisa:\n\n📞 Telepon: (021) 1500-123\n📱 WhatsApp: +62 811-2345-6789\n\nAda yang lain bisa saya bantu?';
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: Date) => {
    const today = new Date();
    const msgDate = new Date(timestamp);
    
    if (msgDate.toDateString() === today.toDateString()) {
      return 'Hari ini';
    }
    
    return msgDate.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const quickReplies = [
    "Cara setor sampah",
    "Tarik saldo",
    "Lokasi bank sampah",
    "Masalah akun"
  ];

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sent':
        return <Check size={12} className="text-gray-400" />;
      case 'delivered':
        return <CheckCheck size={12} className="text-gray-400" />;
      case 'read':
        return <CheckCheck size={12} className="text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-green-600 text-white">
                    AS
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <Circle size={8} className="text-white fill-current" />
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900">EcoBank Support</h3>
                <div className="flex items-center gap-2">
                  {agentStatus === 'typing' ? (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span>mengetik...</span>
                    </div>
                  ) : (
                    <>
                      <Circle size={8} className="text-green-500 fill-current" />
                      <span className="text-sm text-green-600">Online</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toast.success("Memulai panggilan...")}
              className="hover:bg-gray-100"
            >
              <Phone size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toast.success("Memulai video call...")}
              className="hover:bg-gray-100"
            >
              <Video size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100"
            >
              <MoreVertical size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const showDate = index === 0 || 
            formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);

          return (
            <div key={message.id}>
              {/* Date Separator */}
              {showDate && (
                <div className="flex justify-center my-4">
                  <Badge variant="outline" className="bg-white text-xs">
                    {formatDate(message.timestamp)}
                  </Badge>
                </div>
              )}

              {/* Message */}
              {message.type === 'system' ? (
                <div className="flex justify-center">
                  <div className="bg-gray-200 text-gray-700 text-xs px-3 py-2 rounded-full max-w-xs text-center">
                    {message.message}
                  </div>
                </div>
              ) : (
                <div className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'agent' && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className="bg-green-600 text-white text-xs">
                        {message.agent?.avatar || 'CS'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-1' : ''}`}>
                    <div className={`p-3 rounded-2xl ${
                      message.type === 'user' 
                        ? 'bg-green-600 text-white rounded-br-md' 
                        : 'bg-white border border-gray-200 rounded-bl-md'
                    }`}>
                      <p className="whitespace-pre-line text-sm leading-relaxed">
                        {message.message}
                      </p>
                    </div>
                    
                    <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                      <span>{formatTime(message.timestamp)}</span>
                      {message.type === 'user' && getStatusIcon(message.status)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-2 justify-start">
            <Avatar className="w-8 h-8 mt-1">
              <AvatarFallback className="bg-green-600 text-white text-xs">
                S
              </AvatarFallback>
            </Avatar>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length <= 3 && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputMessage(reply)}
                className="whitespace-nowrap flex-shrink-0 bg-white hover:bg-gray-50"
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end gap-3">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toast.success("Fitur kamera akan segera tersedia")}
              className="hover:bg-gray-100"
            >
              <Camera size={20} className="text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toast.success("Fitur attachment akan segera tersedia")}
              className="hover:bg-gray-100"
            >
              <Paperclip size={20} className="text-gray-500" />
            </Button>
          </div>

          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ketik pesan..."
              className="pr-20 rounded-full border-gray-300 focus:border-green-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toast.success("Emoji picker akan segera tersedia")}
                className="w-8 h-8 hover:bg-gray-100"
              >
                <Smile size={16} className="text-gray-500" />
              </Button>
              
              {inputMessage.trim() ? (
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="w-8 h-8 bg-green-600 hover:bg-green-700 rounded-full"
                >
                  <Send size={14} className="text-white" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toast.success("Fitur voice message akan segera tersedia")}
                  className="w-8 h-8 hover:bg-gray-100"
                >
                  <Mic size={16} className="text-gray-500" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Agent Info */}
        <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>Biasanya membalas dalam beberapa menit</span>
          </div>
        </div>
      </div>
    </div>
  );
}