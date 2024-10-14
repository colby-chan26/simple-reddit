import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useViewContent } from '@/components/providers/ViewContentProvider';
import { formatNumberWithCommas } from '@/utils';
import { Button } from '../ui/button';
import { useRedditUser } from '../providers/UserProvider';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { useEffect, useState } from 'react';

const SubredditInfoCard = () => {
  const { viewContent } = useViewContent();
  const { userAction } = useRedditUser();
  const subreddit = viewContent?.subreddit;
  const [isSubscribed, setIsSubscribed] = useState(
    subreddit?.user_is_subscriber ?? false
  );
  const [inAction, setInAction] = useState(false);

  useEffect(() => {
    setIsSubscribed(subreddit?.user_is_subscriber ?? false);
  }, [subreddit]);

  const joinSubreddit = () => {
    setInAction(true);
    userAction(() =>
      subreddit?.subscribe().then(() => {
        setIsSubscribed(true);
        setInAction(false);
      })
    );
  };

  const leaveSubreddit = () => {
    setInAction(true);
    userAction(() =>
      subreddit?.unsubscribe().then(() => {
        setIsSubscribed(false);
        setInAction(false);
      })
    );
  };

  return (
    <div className='pt-12'>
      <Card className='border-2'>
        <CardHeader className='p-2'>
          <div className='w-full flex flex-col items-center justify-center border-b-4 py-2'>
            <Avatar className='-mt-14 h-[80px] w-[80px]'>
              <AvatarImage
                className=''
                src={subreddit?.icon_img || subreddit?.community_icon}
                alt='User Avatar'
              />
              <AvatarFallback className='bg-white'>r/</AvatarFallback>
            </Avatar>
            <CardTitle className='text-[max(99%,1rem)] pt-1 font-bold'>
              {subreddit?.display_name}
            </CardTitle>
            <CardDescription>{`${formatNumberWithCommas(
              subreddit?.subscribers ?? 0
            )} Members`}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className='text-[clamp(.9rem,1vw,1rem)] h-fit p-3 pt-0'>
          <ScrollArea type='always' className='h-full'>
            <ScrollBar />
            <div className='max-h-32 h-full w-[90%]'>
              {subreddit?.public_description}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className='p-2 pt-0'>
          {isSubscribed ? (
            <div className='border-t-4 w-full flex flex-col items-center justify-center pt-2'>
              <Button
                disabled={inAction}
                onClick={leaveSubreddit}
                className='rounded-full bg-red-600 w-[75%] hover:bg-red-800 py-0 h-7'
              >
                Leave
              </Button>
            </div>
          ) : (
            <div className='border-t-4 w-full flex flex-col items-center justify-center pt-2'>
              <Button
                disabled={inAction}
                onClick={joinSubreddit}
                className='rounded-full bg-orange-500 w-[75%] hover:bg-orange-700 py-0 h-7'
              >
                Join
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SubredditInfoCard;
