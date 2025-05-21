// components/SocketProvider.tsx
'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

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
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!session?.backendToken?.accessToken) return;

    // Initialize socket connection with enhanced options
    socketRef.current = io('http://localhost:8000', {
      auth: { token: session.backendToken.accessToken },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity, // Keep trying to reconnect
      reconnectionDelay: 1000,       // Start with 1 second delay
      reconnectionDelayMax: 5000,    // Maximum 5 seconds delay
      randomizationFactor: 0.5,      // Randomize reconnection timing
    });

    // Connection status handlers
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

    // Set up event listeners
    socketRef.current.on('connect', onConnect);
    socketRef.current.on('disconnect', onDisconnect);
    socketRef.current.on('error', onError);

    // Cleanup function
    return () => {
      if (socketRef.current) {
        // Remove all listeners
        socketRef.current.off('connect', onConnect);
        socketRef.current.off('disconnect', onDisconnect);
        socketRef.current.off('error', onError);
        
        // Only disconnect when provider unmounts (page refresh/close)
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [session?.backendToken?.accessToken]);

  return (
    <SocketContext.Provider value={{ 
      socket: socketRef.current,
      isConnected,
      error
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);