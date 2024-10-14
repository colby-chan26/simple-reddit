/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useViewContent } from '@/components/providers/ViewContentProvider';
import Snoowrap, { Submission, Subreddit } from 'snoowrap';
import InfiniteScrollArea from '@/components/InfiniteScrollArea';
import Post from '@/components/posts/Post';
import FeedFilters, { FILTER_TYPES, TOP_TIMES } from './FeedFilters';
import { ListingOptions } from 'snoowrap/dist/objects';

export type FeedGetter = Subreddit | Snoowrap | undefined;

const getPostsByFilter = async (
  feedGetter: FeedGetter | undefined,
  filterType: FILTER_TYPES | undefined,
  options: ListingOptions,
  snoowrapSource: string | undefined
) => {
  if (!feedGetter || !filterType) {
    return [];
  }
  const args = [];
  if (feedGetter instanceof Snoowrap) {
    args.push(snoowrapSource);
  }
  args.push(options);
  switch (filterType) {
    case FILTER_TYPES.HOT:
      return await (feedGetter.getHot as any)(...args);
    case FILTER_TYPES.TOP:
      return await (feedGetter.getTop as any)(...args);
    case FILTER_TYPES.NEW:
      return await (feedGetter.getNew as any)(...args);
    case FILTER_TYPES.RISING:
      return await (feedGetter.getRising as any)(...args);
    default:
      return [];
  }
};

interface FeedProps {
  feedGetter: FeedGetter;
  snooWrapSource?: string;
}

const Feed = ({ feedGetter, snooWrapSource }: FeedProps) => {
  const { setViewContent } = useViewContent();

  const [posts, setPosts] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<FILTER_TYPES>(FILTER_TYPES.HOT);
  const topTimeRef = useRef<TOP_TIMES>();
  const afterRef = useRef<string>();

  const loadMorePosts = useCallback(
    async (
      feedGetter: FeedGetter | undefined,
      filterType: FILTER_TYPES,
      snooWrapSource?: string
    ) => {
      if (!feedGetter || !filterType || afterRef.current === null) {
        return;
      }
      setLoading(true);
      try {
        const options = {
          ...(afterRef.current && { after: afterRef.current }),
          ...(topTimeRef.current && { time: topTimeRef.current }),
        };
        const newPosts = await getPostsByFilter(
          feedGetter,
          filterType,
          options,
          snooWrapSource
        );
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        afterRef.current = (newPosts as any)['_query']?.after;
      } catch (error) {
        console.error(error);
        afterRef.current = undefined;
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!feedGetter) {
      return;
    }
    setPosts([]);
    setFilterType(FILTER_TYPES.HOT);
    afterRef.current = undefined;
    loadMorePosts(feedGetter, FILTER_TYPES.HOT, snooWrapSource);
  }, [feedGetter, loadMorePosts, snooWrapSource]);

  const onPostClick = useCallback(
    (submission: Submission) => {
      setViewContent((prevContent) => ({
        ...prevContent,
        submission: submission,
      }));
    },
    [setViewContent]
  );

  const createPost = useCallback(
    (post: Submission) => (
      <Post key={post.id} submission={post} onPostClick={onPostClick} />
    ),
    [onPostClick]
  );

  const onFilterClick = useCallback(
    (activeFilter: FILTER_TYPES, time?: TOP_TIMES) => {
      topTimeRef.current = time;
      setFilterType(activeFilter);
      setPosts([]);
      afterRef.current = undefined;
      loadMorePosts(feedGetter, activeFilter, snooWrapSource);
    },
    [loadMorePosts, feedGetter, snooWrapSource]
  );

  return (
    <div className='h-full flex flex-col gap-3'>
      <div className='w-full flex justify-center'>
        <FeedFilters activeFilter={filterType} onClick={onFilterClick} />
      </div>
      <InfiniteScrollArea
        items={posts}
        loadMoreItems={() =>
          loadMorePosts(feedGetter, filterType, snooWrapSource)
        }
        loading={loading}
        createItem={createPost}
      />
    </div>
  );
};

export default Feed;
