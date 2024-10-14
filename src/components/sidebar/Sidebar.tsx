import { ScrollArea } from '@/components/ui/scroll-area';
import SubredditInfoCard from './SubredditInfoCard';
import PageInfoCard from './PageInfoCard';
import { useViewContent } from '../providers/ViewContentProvider';
import RecentsCard from './RecentsCard';
import SubscriptionsCard from './SubscriptionsCard';
import { useRedditUser } from '../providers/UserProvider';
import ButtonBar from '../ButtonBar';

const SideBar = ({ screenWidth }: { screenWidth: number }) => {
  const { viewContent } = useViewContent();
  const { redditUser } = useRedditUser();

  return (
    <ScrollArea className='h-full'>
      <div className='flex flex-col px-3 gap-3'>
        {screenWidth < 1024 && (
          <div className='flex w-full justify-center'>
            <ButtonBar />
          </div>
        )}
        {viewContent?.page && <PageInfoCard />}
        {viewContent?.subreddit && <SubredditInfoCard />}
        <RecentsCard />
        {redditUser && <SubscriptionsCard />}
      </div>
    </ScrollArea>
  );
};

export default SideBar;
