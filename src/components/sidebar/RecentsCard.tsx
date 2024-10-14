import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCallback, useState } from 'react';
import {
  getRecents,
  rearrangeRecents,
  Recent,
  RECENTS_UPDATED_EVENT,
} from '../recents';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useViewContent } from '@/components/providers/ViewContentProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSnoowrap } from '@/components/providers/SnoowrapProvider';

interface RecentItemProps {
  recentItem: Recent;
  onClick: () => void;
}

const RecentItem = ({ recentItem, onClick }: RecentItemProps) => {
  return (
    <Button
      variant='ghost'
      className='w-full justify-start p-0'
      onClick={onClick}
    >
      <div className='flex flex-row items-center gap-1'>
        <Avatar>
          <AvatarImage
            src={recentItem.subredditImgUrl}
            alt='Subreddit Avatar'
          />
          <AvatarFallback className='bg-slate-300'>r/</AvatarFallback>
        </Avatar>
        {recentItem.displayName}
      </div>
    </Button>
  );
};

const RecentsCard = () => {
  const { snoowrap } = useSnoowrap();
  const { setViewContent } = useViewContent();

  const [recents, setRecents] = useState<Recent[]>(getRecents());
  const [isOpen, setIsOpen] = useState(true);

  window.addEventListener(RECENTS_UPDATED_EVENT, () => {
    setRecents(getRecents());
  });

  const onRecentItemClick = useCallback(
    (recentItem: Recent) => {
      snoowrap
        ?.getSubreddit(recentItem.name)
        .fetch()
        .then((subreddit) => {
          setViewContent({ subreddit });
          rearrangeRecents(recentItem);
        });
    },
    [setViewContent, snoowrap]
  );

  return (
    <Card className='border-2'>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className='p-2'>
          <CollapsibleTrigger asChild>
            <div className='w-full flex flex-row items-center justify-between pb-0'>
              <CardTitle className='w-fit text-[max(99%,1rem)] leading-none pl-1 pt-1'>
                Recents
              </CardTitle>
              <Button variant='ghost' className='h-5 w-5 p-0'>
                {isOpen ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
                <span className='sr-only'>Toggle</span>
              </Button>
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className='text-[clamp(.9rem,1vw,1rem)] h-fit p-3 pt-0'>
            <Separator className='px-1' />
            <div className='flex flex-col gap-2 pt-2'>
              {recents?.map((recentItem) => (
                <RecentItem
                  key={recentItem.displayName + 'recentItem'}
                  recentItem={recentItem}
                  onClick={() => onRecentItemClick(recentItem)}
                />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default RecentsCard;
