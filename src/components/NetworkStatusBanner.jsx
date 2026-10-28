import { useState, useEffect } from 'react';
import { WifiOff, Wifi, CheckCircle2 } from 'lucide-react';

export default function NetworkStatusBanner() {
  const [isOnline, setIsOnline] = useState(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div 
      className={`network-status-banner ${isOnline ? 'is-reconnected' : 'is-offline'}`}
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 'var(--z-toast, 2000)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '10px 18px',
        borderRadius: '9999px',
        fontSize: '13px',
        fontWeight: 500,
        maxWidth: 'calc(100vw - 28px)',
        width: 'max-content',
        boxSizing: 'border-box',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        backgroundColor: isOnline ? 'rgba(236, 253, 245, 0.94)' : 'rgba(254, 242, 242, 0.95)',
        color: isOnline ? '#065F46' : '#991B1B',
        border: isOnline ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)'
      }}
    >
      {isOnline ? (
        <>
          <Wifi size={16} />
          <span>Conexión restablecida. Sincronización en la nube disponible.</span>
        </>
      ) : (
        <>
          <WifiOff size={16} />
          <span>
            Sin conexión. Tus borradores se conservan localmente; la IA se reanudará al reconectar.
          </span>
        </>
      )}
    </div>
  );
}
