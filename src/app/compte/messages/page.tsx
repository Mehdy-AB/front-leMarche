// app/chat/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState, useCallback } from 'react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import { UserAvatar } from '@/components/all/UserAvatar';
import Image from 'next/image';
import { useSocket } from '@/app/socket-provider';

type ConversationItem = {
  id: number;
  user: {
    id: number;
    image: { url: string } | null;
    username: string;
    fullName: string;
    activeAt: Date;
    phone: string;
    email: string;
    isOnline: boolean;
  };
  ad: {
    id: number;
    title: string;
    price: number;
    media: {
      media: {
        url: string;
      };
    }[];
  };
  time: string;
};

type Message = {
  id: number;
  senderId: number;
  conversationId: number;
  content: string;
  read: boolean;
  sentAt: Date;
};

export default function ChatPage() {
  const { socket, isConnected } = useSocket();
  const { data: session } = useSession();
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [unread, setUnread] = useState<Record<number, boolean>>({});
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const messageContainerRef = useRef<HTMLDivElement>(null);
  const selectedConversationObj = conversations.find((c) => c.id === selectedConversation);
  const observerRef = useRef<IntersectionObserver>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  // Check scroll position
  const checkScrollPosition = useCallback(() => {
    if (!messageContainerRef.current) return;
    
    const { scrollTop } = messageContainerRef.current;
    const atBottom = scrollTop === 0; // Because we're using flex-col-reverse
    
    setIsAtBottom(atBottom);
    setShowScrollButton(!atBottom);
    
    // Mark messages as seen if at bottom
    if (atBottom && selectedConversation) {
      markMessagesAsSeen(selectedConversation);
    }
  }, [selectedConversation]);

  // Initialize socket listeners
  useEffect(() => {
    if (!socket || !session) return;

    const onContacts = (data: { conversation: ConversationItem[]; hasMore: boolean }) => {
      setConversations(data.conversation);
      setInitialLoadComplete(true);
      
      // If we have a selected conversation but no messages, load them
      if (selectedConversation && messages.length === 0) {
        loadMessages(selectedConversation);
      }
    };

    const onReceiveMessage = (message: Message) => {
      const isCurrentChat = message.conversationId === selectedConversation;
      const isFromMe = message.senderId === session.user.id;

      if (!isCurrentChat) {
        setUnread((prev) => ({ ...prev, [message.conversationId]: true }));
        new Audio("/notification.mp3").play();
        moveConversationToTop(message.conversationId);
      }

      setMessages((prev) => [message, ...prev]);
      
      if (isCurrentChat && isAtBottom && !isFromMe) {
        setTimeout(() => {
          scrollToBottom();
          markMessagesAsSeen(message.conversationId);
        }, 50);
      } else if (isCurrentChat && !isFromMe) {
        setShowScrollButton(true);
      }
    };

    const onMessages = (data: { messages: Message[]; hasMore: boolean }) => {
      console.log('Received messages:', data); // Debug log
      if (page === 0) {
        // Initial load or new conversation
        setMessages(data.messages);
        setTimeout(() => {
          scrollToBottom();
        }, 50);
      } else {
        // Pagination load - keep scroll position
        const container = messageContainerRef.current;
        if (container) {
          scrollPositionRef.current = container.scrollHeight - container.scrollTop;
        }
        
        setMessages((prev) => [...data.messages, ...prev]);
        
        if (container) {
          requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight - scrollPositionRef.current;
          });
        }
      }
      setHasMoreMessages(data.hasMore);
      setLoadingMore(false);
    };

    const onMessagesSeen = ({ conversationId }: { conversationId: number }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.conversationId === conversationId ? { ...m, read: true } : m
        )
      );
    };

    const onMessageSent = (message: Message) => {
      setIsSending(false);
      // Replace temporary message with server-confirmed one
      setMessages(prev => prev.map(m => 
        m.id === message.id || (m.content === message.content && m.senderId === message.senderId) 
          ? message 
          : m
      ));
    };

    socket.on('contacts', onContacts);
    socket.on('receiveMessage', onReceiveMessage);
    socket.on('messages', onMessages);
    socket.on('messagesSeen', onMessagesSeen);
    socket.on('messageSent', onMessageSent);

    // Initial load
    socket.emit('getContacts');

    return () => {
      socket.off('contacts', onContacts);
      socket.off('receiveMessage', onReceiveMessage);
      socket.off('messages', onMessages);
      socket.off('messagesSeen', onMessagesSeen);
      socket.off('messageSent', onMessageSent);
    };
  }, [socket, session, selectedConversation, page, isAtBottom, messages.length]);

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversation && socket) {
      console.log('Loading messages for conversation:', selectedConversation); // Debug log
      setMessages([]);
      setPage(0);
      setHasMoreMessages(true);
      socket.emit('getMessages', { 
        conversationId: selectedConversation, 
        limit: 20 
      });
      setUnread((prev) => ({ ...prev, [selectedConversation]: false }));
    }
  }, [selectedConversation, socket]);

  // Set up scroll event listener
  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScrollPosition);
    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
    };
  }, [checkScrollPosition]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!messageContainerRef.current || !hasMoreMessages) return;

    const options = {
      root: messageContainerRef.current,
      rootMargin: '100px',
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingMore && hasMoreMessages) {
        loadMoreMessages();
      }
    }, options);

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMoreMessages, loadingMore]);

  const scrollToBottom = useCallback(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = 0; // Because of flex-col-reverse
    }
  }, []);

  const markMessagesAsSeen = useCallback((conversationId: number) => {
    if (!socket) return;
    console.log('Marking messages as seen for conversation:', conversationId); // Debug log
    socket.emit('markAsSeen', { conversationId });
  }, [socket]);

  const moveConversationToTop = useCallback((conversationId: number) => {
    setConversations((prev) => {
      const existing = prev.find((c) => c.id === conversationId);
      if (!existing) return prev;
      return [existing, ...prev.filter((c) => c.id !== conversationId)];
    });
  }, []);

  const loadMessages = useCallback((conversationId: number) => {
    if (!socket || conversationId === selectedConversation) return;
    
    console.log('Loading messages for:', conversationId); // Debug log
    setSelectedConversation(conversationId);
    setMessages([]);
    setPage(0);
    setHasMoreMessages(true);
    setUnread((prev) => ({ ...prev, [conversationId]: false }));
    
    socket.emit('getMessages', { 
      conversationId, 
      limit: 20 
    });
    markMessagesAsSeen(conversationId);
  }, [socket, selectedConversation, markMessagesAsSeen]);

  const loadMoreMessages = useCallback(() => {
    if (!socket || !selectedConversation || loadingMore || !hasMoreMessages) return;
    
    console.log('Loading more messages, page:', page + 1); // Debug log
    setLoadingMore(true);
    const nextPage = page + 1;
    socket.emit('getMessages', {
      conversationId: selectedConversation,
      skip: nextPage * 20,
      limit: 20,
    });
    setPage(nextPage);
  }, [socket, selectedConversation, loadingMore, hasMoreMessages, page]);

  const sendMessage = useCallback(() => {
    if (!newMessage || !selectedConversation || !socket || isSending) return;

    console.log('Sending message:', newMessage); // Debug log
    setIsSending(true);
    
    // Optimistically add the message
    const tempMessage: Message = {
      id: Date.now(), // Temporary ID
      senderId: session?.user?.id || 0,
      conversationId: selectedConversation,
      content: newMessage,
      read: false,
      sentAt: new Date()
    };
    
    setMessages(prev => [tempMessage, ...prev]);
    setNewMessage("");
    moveConversationToTop(selectedConversation);
    setTimeout(scrollToBottom, 50);

    socket.emit('sendMessage', {
      conversationId: selectedConversation,
      content: newMessage,
    });
  }, [newMessage, selectedConversation, socket, moveConversationToTop, isSending, session, scrollToBottom]);

  if (!session) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="flex flex-col h-screen">
      <Header session={session} />
      
      <div className="flex flex-1 overflow-hidden bg-gray-50">
        {/* Mobile sidebar toggle */}
        <button
          className="md:hidden fixed bottom-4 right-4 z-20 bg-blue-500 text-white p-3 rounded-full shadow-lg"
          onClick={() => setMobileSidebarOpen(true)}
        >
          ☰
        </button>

        {/* Conversations sidebar */}
        <div
          className={`fixed md:static inset-y-0 left-0 w-72 bg-white border-r z-10 transform ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } transition-transform duration-300`}
        >
          <div className="p-4 border-b flex justify-between items-center bg-white">
            <h2 className="text-xl font-semibold">Messages</h2>
            <button
              className="md:hidden text-gray-500"
              onClick={() => setMobileSidebarOpen(false)}
            >
              ✕
            </button>
          </div>
          
          <div className="overflow-y-auto h-[calc(100%-60px)]">
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    loadMessages(conv.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`flex items-center p-3 border-b cursor-pointer hover:bg-gray-50 ${
                    conv.id === selectedConversation ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      {conv.user.image?.url ? (
                        <Image 
                          src={conv.user.image.url} 
                          alt="" 
                          width={48} 
                          height={48} 
                          className="object-cover"
                        />
                      ) : (
                        <UserAvatar userName={conv.user.username} height={48} />
                      )}
                    </div>
                    {conv.user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {conv.ad?.title || conv.user.fullName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {conv.ad?.title ? 'Ad: ' + conv.ad.title : conv.user.username}
                    </p>
                  </div>
                  
                  {unread[conv.id] && (
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                {initialLoadComplete ? 'No conversations found' : 'Loading conversations...'}
              </div>
            )}
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col bg-white relative">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  {selectedConversationObj?.user.image?.url ? (
                    <Image 
                      src={selectedConversationObj.user.image.url} 
                      alt="" 
                      width={40} 
                      height={40} 
                      className="object-cover"
                    />
                  ) : (
                    <UserAvatar userName={selectedConversationObj?.user.username || ''} height={40} />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">
                    {selectedConversationObj?.user.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversationObj?.user.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              
              <div 
                ref={messageContainerRef}
                className="flex-1 overflow-y-auto flex flex-col-reverse p-4"
              >
                {messages.length > 0 ? (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex mb-3 ${message.senderId === session.user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.senderId === session.user.id 
                              ? 'bg-blue-500 text-white rounded-br-none' 
                              : 'bg-gray-200 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          <p>{message.content}</p>
                          <div className={`text-xs mt-1 flex items-center ${
                            message.senderId === session.user.id 
                              ? 'text-blue-100 justify-end' 
                              : 'text-gray-500 justify-start'
                          }`}>
                            {new Date(message.sentAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            {message.senderId === session.user.id && (
                              <span className="ml-1">
                                {message.read ? '✓✓' : '✓'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={sentinelRef} className="h-1" />
                    {loadingMore && (
                      <div className="flex justify-center p-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    {loadingMore ? 'Loading messages...' : 'No messages yet'}
                  </div>
                )}
              </div>
              
              {/* Scroll to bottom button */}
              {showScrollButton && (
                <button
                  onClick={() => {
                    scrollToBottom();
                    if (selectedConversation) {
                      markMessagesAsSeen(selectedConversation);
                    }
                  }}
                  className="fixed bottom-20 right-4 md:right-72 bg-blue-500 text-white p-2 rounded-full shadow-lg z-10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
              
              <div className="p-4 border-t bg-white">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!isConnected || isSending}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!isConnected || !newMessage || isSending}
                    className="ml-2 p-2 bg-blue-500 text-white rounded-full disabled:bg-gray-300"
                  >
                    {isSending ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Select a conversation to start chatting</p>
            </div>
          )}
        </div>

        {/* User info sidebar */}
        {selectedConversationObj?.user && (
          <div className="hidden lg:block w-72 border-l p-4 overflow-y-auto">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                {selectedConversationObj.user.image?.url ? (
                  <Image 
                    src={selectedConversationObj.user.image.url} 
                    alt="" 
                    width={96} 
                    height={96} 
                    className="object-cover"
                  />
                ) : (
                  <UserAvatar userName={selectedConversationObj.user.username} height={96} />
                )}
              </div>
              
              <h3 className="text-xl font-semibold">
                {selectedConversationObj.user.fullName}
              </h3>
              <p className="text-gray-500">
                @{selectedConversationObj.user.username}
              </p>
              
              <div className="mt-2 flex items-center">
                <div className={`w-2 h-2 rounded-full mr-1 ${
                  selectedConversationObj.user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span className="text-sm text-gray-500">
                  {selectedConversationObj.user.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <a 
                  href={`mailto:${selectedConversationObj.user.email}`} 
                  className="text-blue-500 hover:underline"
                >
                  {selectedConversationObj.user.email}
                </a>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                <a 
                  href={`tel:${selectedConversationObj.user.phone}`} 
                  className="text-blue-500 hover:underline"
                >
                  {formatPhone(selectedConversationObj.user.phone)}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      
      
    </div>
  );
}
function formatPhone(phone: string): string {
  return phone.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}
