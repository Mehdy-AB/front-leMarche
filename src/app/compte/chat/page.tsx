"use client";

import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Section } from "lucide-react";

type User = {
  username: string;
  isOnline: boolean;
  avatarUrl?: string;
};

type Message = {
  id: number;
  content: string;
  sender: { username: string };
  receiver: { username: string };
  timestamp: string;
  seen: boolean;
};

export default function ChatPage() {
  const session = useSession();
  const [inputName, setInputName] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
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

  const socketRef = useRef<Socket | null>(null);
  const selectedUserRef = useRef<string | null>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const fetchLockRef = useRef(false);

  const markMessagesAsSeen = () => {
    if (!selectedUser || !socketRef.current) return;
    socketRef.current.emit("markAsSeen", { from: selectedUser });
    setMessages((prev) =>
      prev.map((m) =>
        m.receiver.username === session.data?.user?.username && !m.seen ? { ...m, seen: true } : m
      )
    );
  };

  useEffect(() => {
    console.log("joining")

    if (!session || !session.data) return;
    console.log("join")
    //  const socket = io(process.env.Backend_URL, { query: { jwt: session.data?.backendToken.accessToken } });




    let socket = io('http://localhost:8000', {
      auth: { token: session.data.backendToken.accessToken },
      transports: ['websocket'], // optional but recommended
    });



    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("connect");
      socket.emit("getContacts");
    });

    socket.on("contacts", (data: { users: User[]; hasMore: boolean }) => {
      if (userPage === 0) {
        console.log(data);
        setUsers(data.users.filter((u) => u.username !== username));
      } else {
        setUsers((prev) => [
          ...prev,
          ...data.users.filter((u) => u.username !== username),
        ]);
      }

      setHasMoreUsers(data.hasMore);
      setLoadingUsers(false);
      userLockRef.current = false;
    });

    socket.on("receiveMessage", (message: Message) => {
      const sender = message.sender.username;
      const receiver = message.receiver.username;

      const isFromMe = sender === username;
      const isToMe = receiver === username;

      const chattingWith = isFromMe ? receiver : sender;

      const isCurrentChat = chattingWith === selectedUserRef.current;

      if (!isCurrentChat) {
        setUnread((prev) => ({ ...prev, [chattingWith]: true }));
        new Audio("/notification.mp3").play();
        moveUserToTop(chattingWith);
      }

      // Append message if relevant to this user
      if (isFromMe || isToMe) {
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
            if (isToMe && alreadyAtBottom) {
              markMessagesAsSeen();
            }
          });
        }
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

    socket.on("messagesSeen", ({ by }: { by: string }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.sender.username === username && m.receiver.username === by
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
    const container = messageContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      console.log("scrolling", container.scrollTop);
      if (
        selectedUser &&
        container.scrollTop >= 0 &&
        messages.some((m) => m.receiver.username === username && !m.seen)
      ) {
        markMessagesAsSeen();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages, selectedUser]);

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
    if (!sentinel || !selectedUser) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loadingMore &&
          hasMoreMessages &&
          selectedUser &&
          !fetchLockRef.current
        ) {
          fetchLockRef.current = true;
          setLoadingMore(true);
          const nextPage = page + 1;
          setPage(nextPage);

          socketRef.current?.emit("getMessages", {
            to: selectedUser,
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
  }, [loadingMore, hasMoreMessages, page, selectedUser]);

  const moveUserToTop = (usernameToMove: string) => {
    setUsers((prevUsers) => {
      const existing = prevUsers.find((u) => u.username === usernameToMove);
      if (!existing) return prevUsers;
      const filtered = prevUsers.filter((u) => u.username !== usernameToMove);
      return [existing, ...filtered];
    });
  };

  const getMessages = (user: string) => {
    if (user === selectedUser) return;

    setSelectedUser(user);
    selectedUserRef.current = user;
    setMessages([]);
    setPage(0);
    setHasMoreMessages(true);
    setIsInitialLoad(true);
    setConversationKey((prev) => prev + 1);

    if (socketRef.current) {
      socketRef.current.emit("getMessages", { to: user, limit: 20 });
      socketRef.current.emit("markAsSeen", { from: user });

      setUnread((prev) => {
        const newUnread = { ...prev };
        delete newUnread[user];
        return newUnread;
      });
    }
  };

  const sendMessage = () => {
    if (newMessage && selectedUser && socketRef.current) {
      socketRef.current.emit("sendMessage", {
        to: selectedUser,
        content: newMessage,
      });

      requestAnimationFrame(() => {
        const container = messageContainerRef.current;
        if (container) {
          container.scrollTop = 0; // ✅ Scroll to bottom for flex-col-reverse
        }
      });

      setNewMessage("");
      moveUserToTop(selectedUser);
      socketRef.current.emit("getContacts");
    }
  };



  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-30 transition-opacity md:hidden ${mobileSidebarOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setMobileSidebarOpen(false)}
      />

      {/* Sidebar - Users List */}
      <aside
        ref={userListRef}
        className={`fixed md:static top-0 left-0 h-full md:h-auto z-40 bg-white border-r border-gray-200 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 w-72 transform transition-transform duration-300 ${mobileSidebarOpen
          ? "translate-x-0"
          : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="p-4 font-semibold text-xl border-b border-gray-200 flex justify-between items-center">
          Sélectionner
          <button
            className="md:hidden text-sm text-gray-500"
            onClick={() => setMobileSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        {users.map((u, i) => {
          const isSelected = selectedUser === u.username;
          return (
            <div
              key={i}
              onClick={() => {
                setMobileSidebarOpen(false);
                getMessages(u.username);
              }}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50 ${isSelected ? "bg-blue-100 font-semibold" : ""
                } border-b border-gray-100`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border">
                {u.avatarUrl ? (
                  <Image
                    src={u.avatarUrl}
                    alt="avatar"
                    width={48}
                    height={48}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-700 font-bold text-sm uppercase">
                    {u.username.slice(0, 2)}
                  </div>
                )}
              </div>
              <div className="flex-1 truncate">
                <div className="font-medium">{u.username}</div>
                <div className="text-xs text-gray-400">Annonce supprimée</div>
              </div>
              {unread[u.username] && (
                <span className="text-xs text-white bg-red-500 px-2 py-0.5 rounded-full">
                  New
                </span>
              )}
            </div>
          );
        })}
      </aside>

      {/* Middle - Chat View */}
      <section className="flex flex-col flex-1 bg-white border-r border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 font-semibold text-lg flex justify-between items-center">
          {selectedUser
            ? `Chat avec ${selectedUser}`
            : "Sélectionner un utilisateur"}
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
            const isMine = msg.sender.username === username;
            const time = new Date(msg.timestamp).toLocaleTimeString([], {
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
                className={`mb-4 flex ${isMine ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl shadow ${isMine
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                    }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <div className="text-[10px] mt-1 text-right opacity-70">
                    {time} {isMine && (msg.seen ? "✓✓ Vu" : "✓ Envoyé")}
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

        {/* Chat Input */}
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

      {/* Right - User Info */}
      {selectedUser && (
        <aside className="hidden lg:flex flex-col w-72 bg-white border-l border-gray-200 p-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden border bg-gray-200 mb-2">
              <Image
                src={
                  users.find((u) => u.username === selectedUser)?.avatarUrl ||
                  "/default-avatar.png"
                }
                alt="avatar"
                width={80}
                height={80}
              />
            </div>
            <h3 className="font-semibold text-lg">{selectedUser}</h3>
            <div className="text-sm text-gray-500 mt-1">Profil recommandé</div>
          </div>

          <div className="mt-6 border border-blue-200 rounded p-4 bg-blue-50 text-sm">
            <h4 className="font-semibold mb-1">
              Demande de rapport d’historique
            </h4>
            <p className="text-gray-700 mb-3">
              Rassurez votre acheteur potentiel en ajoutant le rapport
              d’historique de votre véhicule.
            </p>
            <button className="text-sm font-medium text-blue-600 border border-blue-600 px-3 py-1.5 rounded hover:bg-blue-100 transition">
              Créer mon rapport d’historique
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
