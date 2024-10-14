/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import React, { createContext, useContext, useState } from 'react';
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { RedditUser } from 'snoowrap';
import { handleAuthorization } from '@/auth/auth';

interface RedditUserContextType {
  redditUser: RedditUser | undefined;
  setRedditUser: React.Dispatch<React.SetStateAction<RedditUser | undefined>>;
  userAction: Function
}

const RedditUserContext = createContext<RedditUserContextType>({
  redditUser: undefined,
  setRedditUser: () => {},
  userAction: () => undefined,
});

interface RedditUserProviderProps {
  children: React.ReactNode;
}

const RedditUserProvider = ({ children }: RedditUserProviderProps) => {
  const [redditUser, setRedditUser] = useState<RedditUser | undefined>(undefined);

  const { toast } = useToast()

  const userAction = (action: Function) => {
    if(!redditUser) {
      toast({
        variant: "destructive",
        title: "Uh Oh...Please Sign In",
        description: "Unable to push data to Reddit!",
        action: <ToastAction onClick={handleAuthorization} altText="Try again">Sign In</ToastAction>,
      })
      return;
    }
    action();
    return;
  }

  return (
    <RedditUserContext.Provider value={{ redditUser, setRedditUser, userAction}}>
      {children}
    </RedditUserContext.Provider>
  );
};

const useRedditUser = () => useContext(RedditUserContext);

export { RedditUserProvider, useRedditUser };
