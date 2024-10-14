import { Button } from '@/components/ui/button';
import { Comment } from 'snoowrap';
import CommentPost from './Comment';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';

const ToRedditButton = ({ link, text }: { link: string; text: string }) => (
  <a target='_blank' href={link}>
    <Button className='bg-orange-500 hover:bg-orange-700 rounded-full'>
      <span className='pr-3'>{text}</span>
      <ExternalLink className='h-5 w-5' />
    </Button>
  </a>
);

interface CommentSectionProps {
  comments: Comment[];
  submissionLink: string;
}

const CommentSection = ({ comments, submissionLink }: CommentSectionProps) => {
  const [displayedComments, setDisplayedComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(0);
  const observerRef = useRef<IntersectionObserver>();
  const maxPages = Math.ceil(comments.length / 10);

  useEffect(() => {
    setDisplayedComments([]);
    setPage(0);
  }, [comments]);

  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && page <= maxPages) {
            setDisplayedComments((displayedComments) => [
              ...displayedComments,
              ...comments.slice(page * 10, (page + 1) * 10),
            ]);
            setPage((page) => page + 1);
          }
        },
        { threshold: 0.9 }
      );
      if (node) observerRef.current.observe(node);
    },
    [comments, page, maxPages]
  );

  return (
    <div className='w-full max-w-full mt-4 pr-2'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-semibold'>Comments</h3>
      </div>
      {displayedComments.map((comment) => (
        <CommentPost key={comment.id} comment={comment} depth={0} />
      ))}
      <div className='h-10 min-h-[40px] flex items-center justify-center'>
        {page <= maxPages ? (
          <div ref={lastPostRef}>
            <Loader2 className='h-6 w-6 animate-spin' />
          </div>
        ) : (
          <ToRedditButton
            link={submissionLink}
            text='View Full Post on Reddit'
          />
        )}
      </div>
    </div>
  );
};

export default CommentSection;
