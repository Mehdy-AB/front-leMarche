'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  error: Error | null;
};

const SocketContext = createContext<SocketContextType>({ 
  socket: null,
  isConnected: false,
  error: null
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!session?.backendToken?.accessToken) return;

    // Initialize socket connection with enhanced options
    socketRef.current = io('https://back-le-marche.vercel.app', {
      auth: { token: session.backendToken.accessToken },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
    });

    const onConnect = () => {
      setIsConnected(true);
      setError(null);
      console.log('Socket connected');
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    };

    const onError = (err: Error) => {
      setError(err);
      console.error('Socket error:', err);
    };

    socketRef.current.on('connect', onConnect);
    socketRef.current.on('disconnect', onDisconnect);
    socketRef.current.on('error', onError);

    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect', onConnect);
        socketRef.current.off('disconnect', onDisconnect);
        socketRef.current.off('error', onError);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [session?.backendToken?.accessToken]);

  return (
    <QueryClientProvider client={queryClient}>
      <SocketContext.Provider value={{ 
        socket: socketRef.current,
        isConnected,
        error
      }}>
        {children}
      </SocketContext.Provider>
    </QueryClientProvider>
  );
};

export const useSocket = () => useContext(SocketContext);