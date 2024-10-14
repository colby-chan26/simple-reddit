import { useSnoowrap } from '../providers/SnoowrapProvider';
import { PAGE_TYPES, useViewContent } from '../providers/ViewContentProvider';
import Feed from './Feed';
import SavedFeed from './saved/SavedFeed';

const Main = () => {
  const { viewContent } = useViewContent();
  const { snoowrap } = useSnoowrap();

  if (viewContent?.page === PAGE_TYPES.SAVED) {
    return <SavedFeed />
  }

  return <Feed feedGetter={viewContent?.subreddit ?? snoowrap} snooWrapSource={viewContent?.page === PAGE_TYPES.POPULAR ? 'popular' : undefined} />;
};

export default Main;
