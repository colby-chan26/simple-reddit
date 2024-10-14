import { useEffect, useState } from 'react';
import {
  ArrowBigUp,
  ArrowBigDown,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Comment, RedditUser } from 'snoowrap';
import { timeSince } from '@/utils';
import { useRedditUser } from '@/components/providers/UserProvider';
import parseHTMLtoComponent from '@/utils/HTMLStringParser';

interface CommentProps {
  comment: Comment;
  depth: number;
}

const CommentPost = ({ comment, depth }: CommentProps) => {
  const { userAction } = useRedditUser();
  const [author, setAuthor] = useState<RedditUser>();
  const [votes, setVotes] = useState(comment.score);
  const [userVote, setUserVote] = useState<boolean | null>(comment.likes);
  const [saved, setSaved] = useState(comment.saved);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (comment?.author.name === '[deleted]') {
      return;
    }
    try {
      comment?.author.fetch().then(setAuthor);
    } catch (e) {
      console.error(e);
    }
  }, [comment?.author]);

  const handleVote = (type: boolean | null) => {
    // update on server
    if (userVote === type) {
      userAction(() => comment.unvote());
    } else {
      if (type) {
        userAction(() => comment.upvote());
      } else {
        userAction(() => comment.downvote());
      }
    }

    // update ui
    if (userVote === type) {
      setVotes(votes + (type ? -1 : 1));
      setUserVote(null);
    } else {
      setVotes(votes + (type ? 1 : -1) + (userVote ? (userVote ? -1 : 1) : 0));
      setUserVote(type);
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    if (saved) {
      userAction(() => comment.unsave());
    } else {
      userAction(() => comment.save());
    }
  };

  const handleCollapseComment = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      key={comment.id}
      className={`mb-4 ${
        depth > 0 ? 'ml-8 pl-4 border-l-2 border-gray-200' : ''
      }`}
    >
      <div className='flex items-start space-x-4'>
        <Avatar className='h-[30px] w-[30px]'>
          <AvatarImage src={author?.icon_img} alt='Author' />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
        <div className='flex-grow'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-semibold'>
                {author?.name ?? '[ DELETED ]'}
              </p>
              <p className='text-xs text-muted-foreground'>
                {timeSince(comment.created_utc)}
              </p>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => handleCollapseComment()}
              className='h-8 w-8'
              aria-label={collapsed ? 'Expand comment' : 'Collapse comment'}
            >
              {collapsed ? (
                <ChevronDown className='h-4 w-4' />
              ) : (
                <ChevronUp className='h-4 w-4' />
              )}
            </Button>
          </div>
          {!collapsed && (
            <>
              <div className='w-[95%]'>
                {parseHTMLtoComponent(comment.body_html)}
              </div>
              <div className='flex items-center gap-2 mt-2'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => handleVote(true)}
                  className={`h-8 w-8 ${userVote ? 'text-orange-500' : ''}`}
                >
                  <ArrowBigUp className='h-4 w-4' />
                </Button>
                <span className='text-sm font-semibold'>{votes}</span>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => handleVote(false)}
                  className={`h-8 w-8 ${
                    userVote === false ? 'text-blue-500' : ''
                  }`}
                >
                  <ArrowBigDown className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => handleSave()}
                  className='h-8 w-8'
                >
                  {saved ? (
                    <BookmarkCheck className='h-4 w-4' />
                  ) : (
                    <Bookmark className='h-4 w-4' />
                  )}
                  <span className='sr-only'>
                    {saved ? 'Unsave comment' : 'Save comment'}
                  </span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {depth >= 4 && comment.replies.length > 0 ? (
        <div className='w-full flex justify-center'>
          <a
            target='_blank'
            href={'https://www.reddit.com' + comment?.permalink}
          >
            <Button className='bg-orange-500 hover:bg-orange-700 rounded-full'>
              <span className='pr-3'>View full discussion On Reddit</span>
              <ExternalLink className='h-5 w-5' />
            </Button>
          </a>
        </div>
      ) : (
        !collapsed &&
        comment.replies.length > 0 &&
        comment.replies.map((reply) => (
          <CommentPost key={reply.id} comment={reply} depth={depth + 1} />
        ))
      )}
    </div>
  );
};

export default CommentPost;
