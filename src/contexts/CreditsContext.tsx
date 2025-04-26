
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

interface CreditsContextType {
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  spendCredits: (amount: number) => boolean;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
};

interface CreditsProviderProps {
  children: ReactNode;
}

const INITIAL_CREDITS = 1000;
const STORAGE_KEY = 'user_credits';

export const CreditsProvider: React.FC<CreditsProviderProps> = ({ children }) => {
  const [credits, setCredits] = useState<number>(INITIAL_CREDITS);
  
  // Load credits from localStorage on initial load
  useEffect(() => {
    const storedCredits = localStorage.getItem(STORAGE_KEY);
    if (storedCredits) {
      setCredits(parseInt(storedCredits, 10));
    } else {
      localStorage.setItem(STORAGE_KEY, INITIAL_CREDITS.toString());
    }
  }, []);

  // Update localStorage when credits change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, credits.toString());
  }, [credits]);

  const spendCredits = (amount: number): boolean => {
    if (amount <= 0) {
      toast.error("Invalid amount");
      return false;
    }
    
    if (credits < amount) {
      toast.error("Insufficient credits", {
        description: `You need ${amount} credits but only have ${credits}`
      });
      return false;
    }
    
    setCredits(prev => prev - amount);
    return true;
  };

  return (
    <CreditsContext.Provider value={{ credits, setCredits, spendCredits }}>
      {children}
    </CreditsContext.Provider>
  );
};
