import React, { createContext, useContext, useState } from 'react';
import Snoowrap from 'snoowrap';

interface SnooWrapContextType {
  snoowrap: Snoowrap | undefined;
  setSnoowrap: React.Dispatch<React.SetStateAction<Snoowrap | undefined>>;
}

const SnoowrapContext = createContext<SnooWrapContextType>({
  snoowrap: undefined,
  setSnoowrap: () => {},
});

interface SnoowrapProviderProps {
  children: React.ReactNode;
}

const SnoowrapProvider = ({ children }: SnoowrapProviderProps) => {
  const [snoowrap, setSnoowrap] = useState<Snoowrap | undefined>(undefined);

  return (
    <SnoowrapContext.Provider value={{ snoowrap, setSnoowrap }}>
      {children}
    </SnoowrapContext.Provider>
  );
};

const useSnoowrap = () => useContext(SnoowrapContext);

export { SnoowrapProvider, useSnoowrap };
