/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useViewContent } from '@/components/providers/ViewContentProvider';
import Snoowrap, { Comment, Listing, Submission, Subreddit } from 'snoowrap';
import InfiniteScrollArea from '@/components/InfiniteScrollArea';
import Post from '@/components/posts/Post';
import FeedFilters, { FILTER_TYPES } from './SavedFilters';
import CommentPost from '@/components/comments/Comment';
import { useRedditUser } from '@/components/providers/UserProvider';

export type FeedGetter = Subreddit | Snoowrap | undefined;

const separateItems = (
  items: Listing<Submission | Comment> | undefined
): [Submission[], Comment[]] => {
  if (!items) {
    return [[], []];
  }
  const comments: Comment[] = [];
  const submissions: Submission[] = [];
  items.forEach((item) => {
    if (Object.prototype.hasOwnProperty.call(item, 'comment_type')) {
      comments.push(item as Comment);
    } else {
      submissions.push(item as Submission);
    }
  });
  return [submissions, comments];
};

const SavedFeed = () => {
  const { setViewContent } = useViewContent();
  const { redditUser } = useRedditUser();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<FILTER_TYPES>(
    FILTER_TYPES.SUBMISSIONS
  );
  const afterRef = useRef<string>();

  const loadMoreItems = useCallback(async () => {
    if (afterRef.current === null) {
      return;
    }
    setLoading(true);
    try {
      const newItems = await redditUser?.getSavedContent({
        after: afterRef.current,
      });
      const [newSubmissions, newComments] = separateItems(newItems);
      setSubmissions((prev) => [...prev, ...newSubmissions]);
      setComments((prev) => [...prev, ...newComments]);
      afterRef.current = (newItems as any)['_query']?.after;
    } catch (error) {
      console.error(error);
      afterRef.current = undefined;
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [redditUser]);

  useEffect(() => {
    setComments([]);
    setSubmissions([]);
    afterRef.current = undefined;
    loadMoreItems();
  }, [loadMoreItems]);

  const onPostClick = useCallback(
    (submission: Submission) => {
      setViewContent((prevContent) => ({
        ...prevContent,
        submission: submission,
      }));
    },
    [setViewContent]
  );

  const createSubmission = useCallback(
    (post: Submission) => (
      <Post key={post.id} submission={post} onPostClick={onPostClick} />
    ),
    [onPostClick]
  );

  const createComment = useCallback(
    (comment: Comment) => (
      <div key={comment.id} className="w-[85%] mx-auto">
        <CommentPost comment={comment} depth={0} />
      </div>
    ),
    []
  );

  const onFilterClick = useCallback((activeFilter: FILTER_TYPES) => {
    setFilterType(activeFilter);
  }, []);

  return (
    <div className='h-full flex flex-col gap-3'>
      <div className='w-full flex justify-center'>
        <FeedFilters activeFilter={filterType} onClick={onFilterClick} />
      </div>
      <InfiniteScrollArea
        // @ts-expect-error: conditional props is correctly defined to the generic component
        items={filterType === FILTER_TYPES.SUBMISSIONS ? submissions : comments}
        loadMoreItems={loadMoreItems}
        loading={loading}
        // @ts-expect-error: conditional props is correctly defined to the generic component
        createItem={
          filterType === FILTER_TYPES.SUBMISSIONS
            ? createSubmission
            : createComment
        }
      />
    </div>
  );
};

export default SavedFeed;
