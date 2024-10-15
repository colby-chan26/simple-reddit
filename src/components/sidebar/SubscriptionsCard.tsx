/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCallback, useState, useRef } from 'react';
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
import { Subreddit } from 'snoowrap';
import InfiniteScrollArea from '../InfiniteScrollArea';
import { addToRecent } from '../recents';

const SubscriptionsCard = () => {
  const { snoowrap } = useSnoowrap();
  const { setViewContent } = useViewContent();

  const [subscriptions, setSubscriptions] = useState<Subreddit[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const afterRef = useRef<string>();

  const loadMoreSubscriptions = useCallback(async () => {
    if (afterRef.current === null) {
      return;
    }
    setLoading(true);
    try {
      const newItems =
        (await snoowrap?.getSubscriptions({
          after: afterRef.current,
        })) ?? [];
      setSubscriptions((prev) => [...prev, ...newItems]);
      afterRef.current = (newItems as any)['_query']?.after;
    } catch (error) {
      console.error(error);
      afterRef.current = undefined;
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [snoowrap]);

  const createSubscriptionItem = useCallback(
    (subscription: Subreddit) => {
      return (
        <Button
          key={subscription.display_name_prefixed + 'subscriptionItem'}
          variant='ghost'
          className='w-full justify-start p-0'
          onClick={() => {
            setViewContent({ subreddit: subscription });
            addToRecent(subscription);
          }}
        >
          <div className='flex flex-row items-center gap-1'>
            <Avatar>
              <AvatarImage
                src={subscription.icon_img || subscription.community_icon}
                alt='Subreddit Avatar'
              />
              <AvatarFallback className='bg-slate-300'>r/</AvatarFallback>
            </Avatar>
            {subscription.display_name_prefixed}
          </div>
        </Button>
      );
    },
    [setViewContent]
  );

  return (
    <Card className='border-2'>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className='p-2'>
          <CollapsibleTrigger asChild>
            <div className='w-full flex flex-row items-center justify-between pb-0'>
              <CardTitle className='w-fit text-[max(99%,1rem)] leading-none pl-1 pt-1'>
                My Subscriptions
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
            <Separator className='px-1 mb-2' />
            <InfiniteScrollArea
              items={subscriptions}
              loading={loading}
              loadMoreItems={loadMoreSubscriptions}
              createItem={createSubscriptionItem}
              containerStyles='h-52 w-full flex flex-col gap-y-2'
            />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default SubscriptionsCard;
