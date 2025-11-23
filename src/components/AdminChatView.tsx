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
  MoreVertical,
  Circle,
  Check,
  CheckCheck,
  Clock
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  type: 'user' | 'admin' | 'system';
  message: string;
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface ChatRoom {
  id: string;
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isActive: boolean;
}

interface AdminChatViewProps {
  onBack: () => void;
}

export function AdminChatView({ onBack }: AdminChatViewProps) {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load admin name and initialize chat data
  useEffect(() => {
    const adminUser = localStorage.getItem("currentUser");
    if (adminUser) {
      const admin = JSON.parse(adminUser);
      setAdminName(admin.name || "Admin");
    }

    // Load all users and create chat rooms
    loadChatRooms();
  }, []);

  const loadChatRooms = () => {
    try {
      const usersJson = localStorage.getItem("ecobank_users");
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Filter out admin users
      const regularUsers = users.filter((user: any) => user.role !== "admin");

      // Create chat rooms for each user
      const rooms: ChatRoom[] = regularUsers.map((user: any) => {
        const chatsJson = localStorage.getItem(`ecobank_chats_${user.id}`);
        const chats = chatsJson ? JSON.parse(chatsJson) : [];
        
        const lastChat = chats[chats.length - 1];
        const unreadCount = chats.filter((chat: any) => chat.type === 'user' && !chat.read).length;

        return {
          id: user.id,
          userId: user.id,
          userName: user.name,
          lastMessage: lastChat?.message || "Mulai percakapan",
          lastMessageTime: lastChat?.timestamp ? new Date(lastChat.timestamp) : new Date(),
          unreadCount: unreadCount,
          isActive: true
        };
      });

      setChatRooms(rooms);

      // Auto-select first room if none selected
      if (!selectedRoomId && rooms.length > 0) {
        setSelectedRoomId(rooms[0].id);
        loadChatMessages(rooms[0].id);
      }
    } catch (error) {
      console.error("Error loading chat rooms:", error);
    }
  };

  const loadChatMessages = (userId: string) => {
    try {
      const chatsJson = localStorage.getItem(`ecobank_chats_${userId}`);
      const chats = chatsJson ? JSON.parse(chatsJson) : [];

      // Get user info
      const usersJson = localStorage.getItem("ecobank_users");
      const users = usersJson ? JSON.parse(usersJson) : [];
      const user = users.find((u: any) => u.id === userId);

      // Convert stored chats to message format
      const formattedMessages: ChatMessage[] = chats.map((chat: any, index: number) => ({
        id: (index + 1).toString(),
        type: chat.type === 'user' ? 'user' : 'admin',
        message: chat.message,
        timestamp: new Date(chat.timestamp),
        status: chat.type === 'admin' ? 'read' : (chat.read ? 'read' : 'delivered'),
        sender: chat.type === 'user' 
          ? { id: userId, name: user?.name || "User", avatar: user?.name.split(" ").map((n: string) => n[0]).join("") }
          : { id: "admin", name: adminName, avatar: adminName.split(" ").map((n: string) => n[0]).join("") }
      }));

      setMessages(formattedMessages);

      // Mark as read
      const updatedChats = chats.map((chat: any) => ({
        ...chat,
        read: true
      }));
      localStorage.setItem(`ecobank_chats_${userId}`, JSON.stringify(updatedChats));

      // Update chat room unread count
      setChatRooms(prev => prev.map(room => 
        room.id === userId ? { ...room, unreadCount: 0 } : room
      ));

      scrollToBottom();
    } catch (error) {
      console.error("Error loading chat messages:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setMessages([]);
    setInputMessage('');
    loadChatMessages(roomId);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedRoomId) return;

    // Add message to local state for immediate display
    const adminMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'admin',
      message: inputMessage,
      timestamp: new Date(),
      status: 'sent',
      sender: {
        id: "admin",
        name: adminName,
        avatar: adminName.split(" ").map((n: string) => n[0]).join("")
      }
    };

    setMessages(prev => [...prev, adminMessage]);
    setInputMessage('');

    // Save to localStorage
    try {
      const chatsJson = localStorage.getItem(`ecobank_chats_${selectedRoomId}`);
      const chats = chatsJson ? JSON.parse(chatsJson) : [];
      
      chats.push({
        type: 'admin',
        message: inputMessage,
        timestamp: new Date().toISOString(),
        read: true
      });

      localStorage.setItem(`ecobank_chats_${selectedRoomId}`, JSON.stringify(chats));

      // Update last message in chat room
      setChatRooms(prev => prev.map(room =>
        room.id === selectedRoomId
          ? { ...room, lastMessage: inputMessage, lastMessageTime: new Date() }
          : room
      ));

      // Update message status
      setMessages(prev => prev.map(msg =>
        msg.id === adminMessage.id ? { ...msg, status: 'read' } : msg
      ));

      toast.success("Pesan terkirim");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Gagal mengirim pesan");
    }
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
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (msgDate.toDateString() === yesterday.toDateString()) {
      return 'Kemarin';
    }
    
    return msgDate.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

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

  const selectedRoom = chatRooms.find(room => room.id === selectedRoomId);

  return (
    <div className="h-screen flex gap-4 bg-gray-50">
      {/* Chat Rooms List - Hidden on mobile, visible on larger screens */}
      <div className="hidden lg:flex w-80 flex-col bg-white shadow-lg border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-900">Chat dengan User</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </Button>
          </div>
          
          <div className="relative">
            <Input
              placeholder="Cari user..."
              className="rounded-lg border-gray-300 focus:border-green-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chatRooms.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <p>Tidak ada user untuk chat</p>
              </div>
            </div>
          ) : (
            chatRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleSelectRoom(room.id)}
                className={`p-3 border-b border-gray-100 cursor-pointer transition-all duration-200 ${
                  selectedRoomId === room.id
                    ? 'bg-green-50 border-l-4 border-l-green-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-blue-500 text-white">
                        {room.userName.split(" ").map((n: string) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      room.isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 text-sm">{room.userName}</h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(room.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {room.lastMessage}
                    </p>
                  </div>

                  {room.unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center p-0">
                      {room.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window - Full width on mobile, takes remaining space on larger screens */}
      {selectedRoom ? (
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg">
          {/* Header with back button for mobile */}
          <div className="bg-white border-b border-gray-200 p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedRoomId(null);
                    setMessages([]);
                  }}
                  className="lg:hidden hover:bg-gray-100"
                >
                  <ArrowLeft size={20} />
                </Button>
                
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-blue-500 text-white">
                    {selectedRoom.userName.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="font-semibold text-gray-900">{selectedRoom.userName}</h3>
                  <div className="flex items-center gap-2">
                    <Circle size={8} className="text-green-500 fill-current" />
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex hover:bg-gray-100"
              >
                <MoreVertical size={18} />
              </Button>
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
                    <div className={`flex gap-2 ${message.type === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      {message.type === 'user' && (
                        <Avatar className="w-8 h-8 mt-1">
                          <AvatarFallback className="bg-blue-500 text-white text-xs">
                            {selectedRoom.userName.split(" ").map((n: string) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className="max-w-xs lg:max-w-md">
                        <div className={`p-3 rounded-2xl ${
                          message.type === 'admin' 
                            ? 'bg-green-600 text-white rounded-br-md' 
                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                        }`}>
                          <p className="whitespace-pre-line text-sm leading-relaxed">
                            {message.message}
                          </p>
                        </div>
                        
                        <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                          message.type === 'admin' ? 'justify-end' : 'justify-start'
                        }`}>
                          <span>{formatTime(message.timestamp)}</span>
                          {message.type === 'admin' && getStatusIcon(message.status)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 p-4 rounded-b-lg">
            <div className="flex items-end gap-3">
              <div className="flex gap-2">
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
                  className="pr-16 rounded-full border-gray-300 focus:border-green-500"
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
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white rounded-lg shadow-lg">
          <div className="text-center text-gray-500">
            <p>Pilih user untuk mulai chat</p>
          </div>
        </div>
      )}
    </div>
  );
}
