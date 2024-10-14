import React, { createContext, useContext, useState } from 'react';
import { Submission, Subreddit } from 'snoowrap';

export enum PAGE_TYPES {
  HOME = 'home',
  POPULAR = 'popular',
  SAVED = 'saved',
}

interface ViewContent {
  subreddit?: Subreddit,
  submission?: Submission, 
  page?: PAGE_TYPES,
}

interface ViewContentContextType {
  viewContent: ViewContent | undefined;
  setViewContent: React.Dispatch<React.SetStateAction<ViewContent | undefined>>;
}

const ViewContentContext = createContext<ViewContentContextType>({
  viewContent: undefined,
  setViewContent: () => {},
});

interface ViewContentProviderProps {
  children: React.ReactNode;
}

const ViewContentProvider = ({ children }: ViewContentProviderProps) => {
  const [viewContent, setViewContent] = useState<ViewContent | undefined>({
    page: PAGE_TYPES.HOME
  });

  return (
    <ViewContentContext.Provider value={{ viewContent, setViewContent }}>
      {children}
    </ViewContentContext.Provider>
  );
};

const useViewContent = () => useContext(ViewContentContext);

export { ViewContentProvider, useViewContent };