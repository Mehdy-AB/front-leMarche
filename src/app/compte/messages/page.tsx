"use client";

import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Header from "@/components/home/Header";
import { useRouter } from "next/navigation";
import Footer from "@/components/home/Footer";
import { UserAvatar } from "@/components/all/UserAvatar";

type ConversationItem = {
  id: number;
  user: {
    id: number;
    image: {url:string} | null;
    username: string;
    fullName:string,
    activeAt:Date,
    phone:string,
    email: string;
    isOnline: boolean;
  };
  ad: {
    id:number
    title: string;
    price: number;
    media: {
      media: {
        url: string;
      };
    }[];
  };
  time: string; // or use Date if it's parsed: `time: Date;`
};


type Message = {
    conversation: {
        id: number;
        activeAt: Date;
        adId: number;
        senderId: number;
        receiverId: number;
    };
} & {
    id: number;
    senderId: number;
    conversationId: number;
    content: string;
    read: boolean;
    sentAt: Date;
}

export default function ChatPage() {
  const session = useSession();
  const router = useRouter()
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [unread, setUnread] = useState<Record<string, boolean>>({});
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  const [conversationKey, setConversationKey] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(0);

  const [userPage, setUserPage] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const userListRef = useRef<HTMLDivElement>(null);
  const userLockRef = useRef(false);
  const selectedConversationObj = conversation?.find((c) => c.id === selectedConversation);

  const socketRef = useRef<Socket | null>(null);
  const selectedConversationIdRef = useRef<number | null>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const fetchLockRef = useRef(false);
  useEffect(()=>{
    console.log(conversation)
  },[conversation])
  const markMessagesAsSeen = () => {
    if (!selectedConversation || !socketRef.current) return;

    socketRef.current.emit("markAsSeen", { conversationId: selectedConversation });
    setMessages((prev) =>
      prev.map((m) =>
        m.conversationId === selectedConversation ? { ...m, seen: true } : m
      )
    );
  };

  useEffect(() => {
    if (!session || !session.data) return;

    const socket = io('http://localhost:8000', {
      auth: { token: session.data.backendToken.accessToken },
      transports: ['websocket'],
    });

    socketRef.current = socket;

   socket.on("connect", () => {
      socket.on("ready", () => {
        socket.emit("getContacts");
      });
    });


    socket.on("contacts", (data: { conversation: ConversationItem[]; hasMore: boolean }) => {
      if (userPage === 0) {
        setConversation(data.conversation);
      } else {
        setConversation((prev) => [
          ...prev,
          ...data.conversation,
        ]);
      }
      setHasMoreUsers(data.hasMore);
      setLoadingUsers(false);
      userLockRef.current = false;
    });

    socket.on("receiveMessage", (message: Message) => {
      if (!session || !session.data) return;
      const senderId = message.senderId;

      const isFromMe = senderId === session.data.user.id;

      const isCurrentChat = message.conversationId === selectedConversationIdRef.current;

      if (!isCurrentChat) {
        setUnread((prev) => ({ ...prev, [message.conversationId]: true }));
        new Audio("/notification.mp3").play();
        moveUserToTop(message.conversationId);
      }

      // Append message if relevant to this user
      setMessages((prev) => [message, ...prev]);

      const container = messageContainerRef.current;
      if (isCurrentChat && container) {
        const alreadyAtBottom = isAtBottom(container);

        requestAnimationFrame(() => {
            // Always scroll to bottom if already at bottom
          if (alreadyAtBottom) {
            container.scrollTop = 0;
            markMessagesAsSeen();
          }

            // ✅ If you're the receiver and already at bottom, mark seen immediately
          if (!isFromMe && alreadyAtBottom) {
            markMessagesAsSeen();
          }
        });
      }

      socket.emit("getContacts");
    });

    socket.on(
      "messages",
      ({
        messages: newMessages,
        hasMore,
        initialLoad,
      }: {
        messages: Message[];
        hasMore: boolean;
        initialLoad?: boolean;
      }) => {
        const container = messageContainerRef.current;
        if (!container) return;

        if (initialLoad) {
          setMessages(newMessages);
          setIsInitialLoad(true);
          requestAnimationFrame(() => {
            container.scrollTop = 0; // Bottom for flex-col-reverse
          });
        } else {
          // Track the first visible message
          const firstVisible = container.querySelector(
            "div[data-id]"
          ) as HTMLDivElement | null;
          const firstVisibleId = firstVisible?.getAttribute("data-id");
          const offsetFromTop = firstVisible?.getBoundingClientRect().top || 0;

          setMessages((prev) => [...prev, ...newMessages]); // Append older messages

          requestAnimationFrame(() => {
            if (firstVisibleId) {
              const target = messageRefs.current[+firstVisibleId];
              if (target) {
                const newOffset = target.getBoundingClientRect().top;
                const scrollAdjust = newOffset - offsetFromTop;
                container.scrollTop += scrollAdjust;
              }
            }
          });
        }

        setHasMoreMessages(hasMore);
        setLoadingMore(false);
      }
    );

    socket.on("messagesSeen", ({ by,conversationId }: { by: number,conversationId:number }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.conversationId=== conversationId && m.senderId !== by
            ? { ...m, seen: true }
            : m
        )
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [session, session.data]);

  function isAtBottom(container: HTMLElement) {
    return container.scrollTop >= 0; // bottom of flex-col-reverse
  }

  useEffect(() => {
    if (!session || !session.data) return;
    const container = messageContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (
        selectedConversation &&
        container.scrollTop >= 0 &&
        messages.some((m) => m.senderId !== session.data.user.id && !m.read)
      ) {
        markMessagesAsSeen();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages, selectedConversation]);

  useEffect(() => {
    const container = userListRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 50 &&
        !loadingUsers &&
        hasMoreUsers &&
        !userLockRef.current
      ) {
        userLockRef.current = true;
        setLoadingUsers(true);
        const nextPage = userPage + 1;
        setUserPage(nextPage);

        socketRef.current?.emit("getContacts", {
          skip: nextPage * 40,
          limit: 40,
        });
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loadingUsers, hasMoreUsers, userPage]);

  useEffect(() => {
    if (!isInitialLoad) return;
    const container = messageContainerRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTop = 0;
      setIsInitialLoad(false);
    });
  }, [conversationKey, isInitialLoad]);

  const topSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = topSentinelRef.current;
    if (!sentinel || !selectedConversation) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loadingMore &&
          hasMoreMessages &&
          selectedConversation &&
          !fetchLockRef.current
        ) {
          fetchLockRef.current = true;
          setLoadingMore(true);
          const nextPage = page + 1;
          setPage(nextPage);

          socketRef.current?.emit("getMessages", {
            to: selectedConversation,
            skip: nextPage * 10,
            limit: 10,
          });

          setTimeout(() => {
            fetchLockRef.current = false;
          }, 400);
        }
      },
      {
        root: messageContainerRef.current,
        threshold: 1.0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [loadingMore, hasMoreMessages, page, selectedConversation,socketRef]);

  const moveUserToTop = (conversationToMove: number) => {
    setConversation((prevConversation) => {
      const existing = prevConversation.find((c) => c.id === conversationToMove);
      if (!existing) return prevConversation;
      const filtered = prevConversation.filter((c) => c.id !== conversationToMove);
      return [existing, ...filtered];
    });
  };

  const getMessages = (conversationId: number) => {
    if (conversationId === selectedConversation) return;

    setSelectedConversation(conversationId);
    selectedConversationIdRef.current = conversationId;
    setMessages([]);
    setPage(0);
    setHasMoreMessages(true);
    setIsInitialLoad(true);
    setConversationKey((prev) => prev + 1);

    if (socketRef.current) {
      socketRef.current.emit("getMessages", { conversationId: conversationId, limit: 20 });
      socketRef.current.emit("markAsSeen", { conversationId: conversationId });

      setUnread((prev) => {
        const newUnread = { ...prev };
        delete newUnread[conversationId];
        return newUnread;
      });
    }
  };

  const sendMessage = () => {
    if (newMessage && selectedConversation && socketRef.current) {
      socketRef.current.emit("sendMessage", {
        conversationId: selectedConversation,
        content: newMessage,
      });

      requestAnimationFrame(() => {
        const container = messageContainerRef.current;
        if (container) {
          container.scrollTop = 0; // ✅ Scroll to bottom for flex-col-reverse
        }
      });

      setNewMessage("");
      moveUserToTop(selectedConversation);
      socketRef.current.emit("getContacts");
    }
  };

  if(!session)return(<div>loading</div>)
  return (
  <div className="h-screen">
    <Header session={session.data} />
    <div className="flexh-[56%] bg-gray-100 text-gray-800 overflow-hidden relative">

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed  bg-opacity-30 z-10 transition-opacity md:hidden ${
          mobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        ref={userListRef}
        className={`fixed md:static top-0 left-0 h-full md:h-auto z-40 bg-white border-r border-gray-200 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 w-72 transform transition-transform duration-300 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 font-semibold text-xl border-b border-gray-200 flex justify-between items-center">
          Conversations
          <button
            className="md:hidden text-sm text-gray-500"
            onClick={() => setMobileSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {conversation?.map((c, idx) => {
          const isSelected = selectedConversation === c.id;
          const imageUrl = c.ad?.media?.[0]?.media?.url || c.user.image?.url || "/default-avatar.png";
          const name = c.ad?.title || c.user.fullName;

          return (
            <div
              key={idx}
              onClick={() => {
                setMobileSidebarOpen(false);
                getMessages(c.id);
              }}
              className={`flex relative items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50 ${
                isSelected ? "bg-blue-100 font-semibold" : ""
              } border-b border-gray-100`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border">
                {!c.ad?c.user?.image?.url?<Image
                      src={c.user?.image?.url}
                      alt={c.user.username}
                      width={48}
                      height={48}
                      className="w-6 h-6 rounded-full object-cover"
                    />:
                    <UserAvatar height={48} userName={c.user?.username || 'A'} />
                    :
                    <Image src={imageUrl} alt="avatar" width={100} height={100} className="object-cover h-[48px] rounded-full" />}
              </div>
              <div className="flex-1 truncate">
                <div className="font-medium truncate">{name}</div>
                <div className="text-xs text-gray-400">
                  {c.ad?.title ? "Annonce active" : "Profil utilisateur"}
                </div>
              </div>
              {unread[c.id] && (
                <span className="text-xs text-white bg-red-500 px-2 py-0.5 rounded-full">Nouveau</span>
              )}
                  {c.ad&&<div 
                   className="absolute bottom-2 right-2 flex items-center gap-2 px-2 py-1 rounded-lg">
                    {c.user?.image?.url?<Image
                      src={c.user?.image?.url}
                      alt={c.user.username}
                      width={20}
                      height={20}
                      className="w-6 h-6 rounded-full object-cover"
                    />:
                    <UserAvatar height={20} userName={c.user?.username || 'A'} />
                    }
                    <div className="text-tiny text-gray-700">
                      <p className="font-semibold">{c.user.fullName}</p>
                    </div>
                  </div> }            
            </div>
          );
        })}
      </aside>

      {/* Chat View */}
      <section className="flex max-h-full flex-col flex-1 border-r border-gray-200">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-200 font-semibold text-lg flex justify-between items-center">
          {selectedConversation ? (
            <a href={`/${(selectedConversationObj?.ad)?`ad/${selectedConversationObj.ad.id}`:`user/${selectedConversationObj?.user.id}`}`} className="hover:underline cursor-pointer">
              {selectedConversationObj?.ad?.title || selectedConversationObj?.user?.username}
            </a>
          ) : (
            "Sélectionner une conversation"
          )}
          <button
            className="md:hidden text-sm text-blue-500"
            onClick={() => setMobileSidebarOpen(true)}
          >
            ☰
          </button>
        </div>

        {/* Messages */}
        <div
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto flex p-6 scrollbar-thin scrollbar-thumb-gray-300 flex-col-reverse"
        >
          {messages.map((msg, i) => {
            const isMine = msg.senderId === session.data?.user.id;
            const time = new Date(msg.sentAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={i}
                data-id={msg.id}
                ref={(el) => {
                  messageRefs.current[msg.id] = el;
                }}
                className={`mb-4 flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl shadow ${
                    isMine ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <div className="text-[10px] mt-1 text-right opacity-70">
                    {time} {isMine && (msg.read ? "✓✓ Vu" : "✓ Envoyé")}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Skeleton Loader */}
          {loadingMore && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="mb-4 flex justify-start">
                  <div className="w-40 h-4 rounded-lg bg-gray-200 animate-pulse" />
                </div>
              ))}
            </>
          )}

          <div ref={topSentinelRef} className="h-1" />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center gap-2 bg-gray-50">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Écrivez votre message"
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
          >
            ➤
          </button>
        </div>
      </section>

      {/* Right Panel */}
      {selectedConversationObj?.user && (
        <aside className="hidden lg:flex flex-col w-72 bg-white border-l border-gray-200 p-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border bg-gray-200 mb-3">
              {selectedConversationObj.user.image?.url ? (
                <Image
                  src={selectedConversationObj.user.image.url}
                  alt="User"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              ) : (
                <UserAvatar height={96} userName={selectedConversationObj.user.username} />
              )}
            </div>

            <a
              href={`/user/${selectedConversationObj.user.id}`}
              className="text-lg font-bold text-gray-800 cursor-pointer"
            >
              {selectedConversationObj.user.fullName}
            </a>

            <a
              href={`/user/${selectedConversationObj.user.id}`}
              className="text-sm text-gray-500 underline cursor-pointer"
            >
              @{selectedConversationObj.user.username}
            </a>

            <div className="text-xs text-gray-400 mt-1">
              {selectedConversationObj.user.isOnline ? "En ligne" : "Actif il y a 6 min"}
            </div>
            <a
              href={`mailto:${selectedConversationObj.user.email}`}
              className="w-full block text-sm py-2 hover:underline"
            >
              {selectedConversationObj.user.email}
            </a>
          </div>

          <div className="mt-6 space-y-3 w-full text-center">
            <button className="w-full shadow-md font-semibold text-lg border rounded-xl py-2">
              +33 {formatPhone(selectedConversationObj.user.phone)}
            </button>
            
          </div>
        </aside>
      )}

    </div>
    <Footer />
  </div>
);

}
function formatPhone(phone: string): string {
  return phone.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}
