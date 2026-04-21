import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MessageSquare,
  Send,
  ArrowLeft,
  Search,
  User,
  Clock,
  CheckCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import {
  getConversations,
  getMessagesBetween,
  sendMessage,
  markMessagesAsRead,
  getProfileByUserId,
} from "@/lib/api";

interface Conversation {
  partnerId: string;
  partnerName: string;
  partnerAvatar: string | null;
  lastMessage: any;
  unreadCount: number;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

const Messages = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(
    searchParams.get("with") || null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [activePartner, setActivePartner] = useState<{
    name: string;
    avatar: string | null;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  // Load conversations list
  useEffect(() => {
    if (!user) return;
    const loadConversations = async () => {
      setIsLoading(true);
      const { data } = await getConversations(user.id);
      
      // Enrich with partner profiles
      const enriched = await Promise.all(
        data.map(async (conv: any) => {
          const { data: profile } = await getProfileByUserId(conv.partnerId);
          return {
            partnerId: conv.partnerId,
            partnerName: profile?.full_name || "Unknown User",
            partnerAvatar: profile?.avatar_url || null,
            lastMessage: conv.lastMessage,
            unreadCount: conv.unreadCount,
          } as Conversation;
        })
      );
      
      setConversations(enriched);
      setIsLoading(false);
    };
    loadConversations();
  }, [user]);

  // Load messages for active conversation
  useEffect(() => {
    if (!user || !activeConversation) return;

    const loadMessages = async () => {
      const { data } = await getMessagesBetween(user.id, activeConversation);
      setMessages(data as Message[]);

      // Load partner info
      const { data: profile } = await getProfileByUserId(activeConversation);
      setActivePartner({
        name: profile?.full_name || "Unknown User",
        avatar: profile?.avatar_url || null,
      });

      // Mark messages as read
      await markMessagesAsRead(user.id, activeConversation);
      
      // Update unread count in conversations list
      setConversations((prev) =>
        prev.map((c) =>
          c.partnerId === activeConversation ? { ...c, unreadCount: 0 } : c
        )
      );
    };
    loadMessages();
  }, [user, activeConversation]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeConversation || !newMessage.trim()) return;

    setIsSending(true);
    const { data, error } = await sendMessage(user.id, activeConversation, newMessage.trim());
    if (!error && data) {
      setMessages((prev) => [...prev, data as Message]);
      setNewMessage("");
    }
    setIsSending(false);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);

    if (diffHrs < 1) return `${Math.floor(diffMs / 60000)}m ago`;
    if (diffHrs < 24) return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    if (diffHrs < 168) return date.toLocaleDateString("en-US", { weekday: "short" });
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-muted/30">
        <div className="container py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              Messages
            </h1>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3" style={{ minHeight: "calc(100vh - 250px)" }}>
            {/* Conversations List */}
            <Card className="lg:col-span-1 overflow-hidden">
              <CardContent className="p-0">
                <div className="border-b p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search conversations..." className="pl-10" />
                  </div>
                </div>

                <div className="max-h-[500px] overflow-y-auto">
                  {isLoading ? (
                    <div className="space-y-1 p-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 p-3 animate-pulse">
                          <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-24 bg-muted rounded" />
                            <div className="h-3 w-36 bg-muted rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="py-12 text-center">
                      <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No conversations yet</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Contact a tutor to start chatting
                      </p>
                    </div>
                  ) : (
                    conversations.map((conv) => (
                      <button
                        key={conv.partnerId}
                        onClick={() => setActiveConversation(conv.partnerId)}
                        className={`flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50 ${
                          activeConversation === conv.partnerId
                            ? "bg-primary/5 border-l-2 border-primary"
                            : ""
                        }`}
                      >
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={conv.partnerAvatar || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {conv.partnerName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm text-foreground truncate">
                              {conv.partnerName}
                            </span>
                            <span className="text-xs text-muted-foreground shrink-0 ml-2">
                              {formatTime(conv.lastMessage.created_at)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-0.5">
                            <p className="text-xs text-muted-foreground truncate">
                              {conv.lastMessage.sender_id === user?.id ? "You: " : ""}
                              {conv.lastMessage.content}
                            </p>
                            {conv.unreadCount > 0 && (
                              <Badge variant="default" className="h-5 min-w-[20px] flex items-center justify-center text-xs p-0 ml-2 shrink-0">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-2 flex flex-col overflow-hidden">
              {activeConversation && activePartner ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center gap-3 border-b p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="lg:hidden"
                      onClick={() => setActiveConversation(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={activePartner.avatar || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {activePartner.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm text-foreground">{activePartner.name}</p>
                      <p className="text-xs text-green-500">Online</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: 300, maxHeight: 450 }}>
                    {messages.map((msg) => {
                      const isMine = msg.sender_id === user?.id;
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                              isMine
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-muted text-foreground rounded-bl-md"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <div className={`flex items-center gap-1 mt-1 ${
                              isMine ? "justify-end" : ""
                            }`}>
                              <span className={`text-[10px] ${
                                isMine ? "text-primary-foreground/60" : "text-muted-foreground"
                              }`}>
                                {formatTime(msg.created_at)}
                              </span>
                              {isMine && (
                                <CheckCheck className={`h-3 w-3 ${
                                  msg.is_read ? "text-blue-300" : "text-primary-foreground/40"
                                }`} />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSend} className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                        disabled={isSending}
                      />
                      <Button type="submit" disabled={isSending || !newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <CardContent className="flex flex-1 items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Select a conversation</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a conversation from the list to start chatting
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Messages;
