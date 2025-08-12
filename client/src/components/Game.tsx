import { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';
import GameInterface from './GameInterface';

export default function Game() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full">
      {isLoading ? <LoadingScreen /> : <GameInterface />}
    </div>
  );
}
