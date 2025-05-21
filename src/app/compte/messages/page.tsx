// app/chat/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import { UserAvatar } from '@/components/all/UserAvatar';
import Image from 'next/image';
import { useSocket } from '@/app/socket-provider';
import Loader from '@/lib/loaders/LineLoader';

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
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [unread, setUnread] = useState<Record<number, boolean>>({});
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const { ref: sentinelRef, inView } = useInView();

  // Fetch conversations
  const { data: conversations = [] } = useQuery<ConversationItem[]>({
    queryKey: ['conversations'],
    queryFn: () => new Promise((resolve) => {
      if (!socket) return resolve([]);
      socket.emit('getContacts', {}, (response: { conversation: ConversationItem[] }) => {
        resolve(response.conversation);
      });
    }),
    enabled: !!socket,
    initialData: [],
  });

  // Fetch messages with pagination
  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['messages', selectedConversation],
    queryFn: async ({ pageParam = 0 }) => {
      if (!socket || !selectedConversation) return { messages: [], hasMore: false };
      
      return new Promise<{ messages: Message[]; hasMore: boolean }>((resolve) => {
        socket.emit('getMessages', { 
          conversationId: selectedConversation,
          skip: pageParam * 20,
          limit: 20,
        }, (data: { messages: Message[]; hasMore: boolean }) => {
          resolve(data);
        });
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length : undefined;
    },
    enabled: !!selectedConversation && !!socket,
    initialPageParam: 0,
  });

  const messages = messagesData?.pages.flatMap(page => page.messages) || [];

  // Mutation for sending messages
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!socket || !selectedConversation) return;
      
      return new Promise<Message>((resolve) => {
        socket.emit('sendMessage', {
          conversationId: selectedConversation,
          content,
        }, (message: Message) => {
          resolve(message);
        });
      });
    },
    onMutate: async (content) => {
      // Optimistic update
      const tempMessage: Message = {
        id: Date.now(),
        senderId: session?.user.id || 0,
        conversationId: selectedConversation || 0,
        content,
        read: false,
        sentAt: new Date()
      };
      
      queryClient.setQueryData(['messages', selectedConversation], (old: any) => {
        return {
          pages: [
            { messages: [tempMessage, ...(old?.pages?.[0]?.messages || [])], 
            hasMore: old?.pages?.[0]?.hasMore || false
          },
            ...old?.pages?.slice(1) || []
          ]
        };
      });
      
      return { tempMessage };
    },
    onSuccess: (message, _, context) => {
      // Replace optimistic update with real message
      queryClient.setQueryData(['messages', selectedConversation], (old: any) => {
        return {
          pages: old.pages.map((page: any, i: number) => ({
            ...page,
            messages: i === 0 
              ? page.messages.map((m: Message) => 
                  m.id === context?.tempMessage.id ? message : m
                )
              : page.messages
          }))
        };
      });
    },
    onError: () => {
      // Rollback optimistic update
      queryClient.setQueryData(['messages', selectedConversation], (old: any) => {
        return {
          pages: old.pages.map((page: any, i: number) => ({
            ...page,
            messages: i === 0 
              ? page.messages.filter((m: Message) => m.id !== context?.tempMessage.id)
              : page.messages
          }))
        };
      });
    }
  });

  // Load more messages when sentinel is in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !session) return;

    const onReceiveMessage = (message: Message) => {
      const isCurrentChat = message.conversationId === selectedConversation;
      const isFromMe = message.senderId === session.user.id;

      if (!isCurrentChat) {
        setUnread((prev) => ({ ...prev, [message.conversationId]: true }));
        new Audio("/notification.mp3").play();
        moveConversationToTop(message.conversationId);
      }

      // Update messages cache
      queryClient.setQueryData(['messages', message.conversationId], (old: any) => {
        if (!old) return { pages: [{ messages: [message], hasMore: false }] };
        
        return {
          pages: old.pages.map((page: any, i: number) => ({
            ...page,
            messages: i === 0 ? [message, ...page.messages] : page.messages
          }))
        };
      });

      if (isCurrentChat && isAtBottom && !isFromMe) {
        setTimeout(() => {
          scrollToBottom();
          markMessagesAsSeen(message.conversationId);
        }, 50);
      }
    };

    const onMessagesSeen = ({ conversationId }: { conversationId: number }) => {
      queryClient.setQueryData(['messages', conversationId], (old: any) => {
        if (!old) return old;
        
        return {
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.map((m: Message) =>
              m.conversationId === conversationId ? { ...m, read: true } : m
            )
          }))
        };
      });
    };

    socket.on('receiveMessage', onReceiveMessage);
    socket.on('messagesSeen', onMessagesSeen);

    return () => {
      socket.off('receiveMessage', onReceiveMessage);
      socket.off('messagesSeen', onMessagesSeen);
    };
  }, [socket, session, selectedConversation, isAtBottom, queryClient]);

  const scrollToBottom = useCallback(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = 0;
    }
  }, []);

  const markMessagesAsSeen = useCallback((conversationId: number) => {
    if (!socket) return;
    socket.emit('markAsSeen', { conversationId });
  }, [socket]);

  const moveConversationToTop = useCallback((conversationId: number) => {
    queryClient.setQueryData(['conversations'], (old: ConversationItem[] = []) => {
      const existing = old.find((c) => c.id === conversationId);
      if (!existing) return old;
      return [existing, ...old.filter((c) => c.id !== conversationId)];
    });
  }, [queryClient]);

  const loadMessages = useCallback((conversationId: number) => {
    if (!socket || conversationId === selectedConversation) return;
    
    setSelectedConversation(conversationId);
    setUnread((prev) => ({ ...prev, [conversationId]: false }));
    markMessagesAsSeen(conversationId);
  }, [socket, selectedConversation, markMessagesAsSeen]);

  const sendMessage = useCallback(() => {
    if (!newMessage || !selectedConversation) return;
    sendMessageMutation.mutate(newMessage);
    setNewMessage("");
    moveConversationToTop(selectedConversation);
    setTimeout(scrollToBottom, 50);
  }, [newMessage, selectedConversation, sendMessageMutation, moveConversationToTop, scrollToBottom]);

  const checkScrollPosition = useCallback(() => {
    if (!messageContainerRef.current) return;
    
    const { scrollTop } = messageContainerRef.current;
    const atBottom = scrollTop === 0;
    
    setIsAtBottom(atBottom);
    
    if (atBottom && selectedConversation) {
      markMessagesAsSeen(selectedConversation);
    }
  }, [selectedConversation, markMessagesAsSeen]);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScrollPosition);
    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
    };
  }, [checkScrollPosition]);

  if (!session) return <Loader/>

  const selectedConversationObj = conversations.find((c) => c.id === selectedConversation);

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
                No conversations found
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
                    <div ref={sentinelRef} />
                    {isFetchingNextPage && (
                      <div className="flex justify-center p-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    No messages yet
                  </div>
                )}
              </div>
              
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
                    disabled={!isConnected || sendMessageMutation.isPending}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!isConnected || !newMessage || sendMessageMutation.isPending}
                    className="ml-2 p-2 bg-blue-500 text-white rounded-full disabled:bg-gray-300"
                  >
                    {sendMessageMutation.isPending ? (
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
      </div>
    </div>
  );
}