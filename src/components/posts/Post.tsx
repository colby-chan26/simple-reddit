import { useEffect, useState } from 'react';
import {
  ArrowBigUp,
  ArrowBigDown,
  Eye,
  Bookmark,
  MessageSquare,
  Link,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RedditUser, Submission, Subreddit } from 'snoowrap';
import PostContent from './PostContent';
import { timeSince } from '@/utils';
import { useRedditUser } from '../providers/UserProvider';
import { useViewContent } from '../providers/ViewContentProvider';
import { addToRecent } from '@/components/recents';
import { useToast } from '@/hooks/use-toast';

type HeaderConfig = {
  icon: string;
  mainText: string;
  description: string;
  onClick?: () => void;
};

interface PostProps {
  submission: Submission;
  showTextContent?: boolean;
  onPostClick?: (submission: Submission) => void;
}

const Post = ({ submission, showTextContent, onPostClick }: PostProps) => {
  const { toast } = useToast();
  const { userAction } = useRedditUser();
  const { viewContent, setViewContent } = useViewContent();

  const showSubreddit = viewContent?.page;

  const [votes, setVotes] = useState(submission.score);
  const [userVote, setUserVote] = useState<boolean | null>(submission.likes);
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>();
  const [isBlurred, setIsBlurred] = useState(true);
  const [saved, setSaved] = useState(submission.saved);

  useEffect(() => {
    const getHeaderConfig = async () => {
      if (submission.author.name === '[deleted]') {
        return;
      }
      try {
        const time = timeSince(submission.created_utc);
        // @ts-expect-error: Type is referenced directly or indirectly in the fulfillment callback of its own 'then' method
        const author: RedditUser = await submission.author.fetch();
        const authorName = author?.name ?? '[DELETED]';
        if (showSubreddit) {
          // @ts-expect-error: Type is referenced directly or indirectly in the fulfillment callback of its own 'then' method
          const subreddit: Subreddit = await submission.subreddit.fetch();
          setHeaderConfig({
            icon: subreddit.icon_img || subreddit.community_icon,
            mainText: subreddit.display_name_prefixed,
            description: `Posted by ${authorName}  •  ${time}`,
            onClick: () => {
              addToRecent(subreddit);
              setViewContent({ subreddit });
            },
          });
          return;
        }
        setHeaderConfig({
          icon: author?.icon_img,
          mainText: authorName,
          description: time,
        });
      } catch (e) {
        console.error(e);
      }
    };

    getHeaderConfig();
  }, [setViewContent, showSubreddit, submission]);

  const handleVote = (type: boolean | null) => {
    // update on server
    if (userVote === type) {
      userAction(() => submission.unvote());
    } else {
      if (type) {
        userAction(() => submission.upvote());
      } else {
        userAction(() => submission.downvote());
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

  const copyLink = () => {
    navigator.clipboard
      .writeText(submission.url)
      .then(() =>
        toast({
          title: 'Link Copied!',
        })
      )
      .catch((err) => console.error('Failed to copy link: ', err));
  };

  const handleSave = () => {
    setSaved(!saved);
    if (saved) {
      userAction(() => submission.unsave());
    } else {
      userAction(() => submission.save());
    }
  };

  const toggleBlur = () => {
    setIsBlurred(!isBlurred);
  };

  return (
    <Card
      className={`max-w-3xl mx-auto w-full ${
        onPostClick ? 'hover:bg-gray-200' : ''
      }`}
      onClick={() => onPostClick?.(submission)}
    >
      <CardHeader className='flex flex-row items-center gap-4 pb-3'>
        <Avatar
          onClick={(e) => {
            e.stopPropagation();
            headerConfig?.onClick?.();
          }}
          className={showSubreddit ? 'cursor-pointer' : ''}
        >
          <AvatarImage src={headerConfig?.icon} alt='Author' />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
        <div>
          <p className='text-sm font-semibold'>
            {headerConfig?.mainText ?? ''}
          </p>
          <p className='text-xs text-muted-foreground'>
            {headerConfig?.description ?? ''}
          </p>
        </div>
      </CardHeader>
      <CardContent className='pb-0'>
        <div className='flex flex-wrap items-center gap-2 mb-2'>
          {submission.over_18 && (
            <Badge
              variant='destructive'
              className='text-xs font-bold bg-red-500 text-white'
            >
              NSFW
            </Badge>
          )}
          <h2 className='text-xl font-bold'>{submission.title}</h2>
          {submission.link_flair_text && (
            <Badge
              variant='secondary'
              className='text-xs font-semibold'
              style={{
                backgroundColor: submission.link_flair_background_color,
                color:
                  submission.link_flair_text_color === 'light'
                    ? 'white'
                    : 'black',
              }}
            >
              {submission.link_flair_text}
            </Badge>
          )}
        </div>
        <div
          className={`relative overflow-hidden `}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`transition-all duration-300 ${
              isBlurred && submission.over_18 ? 'blur-[80px]' : ''
            }`}
          >
            <PostContent
              submission={submission}
              showTextContent={showTextContent}
            />
          </div>
          {isBlurred && submission.over_18 && (
            <div className='w-full absolute inset-0 flex items-center justify-center bg-transparent'>
              <div className='absolute inset-0 bg-background/30 backdrop-blur-sm' />
              <Button
                onClick={toggleBlur}
                variant='secondary'
                className='z-10 flex items-center gap-2'
              >
                <Eye className='h-4 w-4' />
                <span>Show NSFW Content</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter
        className='flex justify-between items-center pt-2 pb-2'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => handleVote(true)}
            className={userVote ? 'text-orange-500' : ''}
          >
            <ArrowBigUp className='h-6 w-6' />
          </Button>
          <span className='font-bold'>{votes}</span>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => handleVote(false)}
            className={userVote === false ? 'text-blue-500' : ''}
          >
            <ArrowBigDown className='h-6 w-6' />
          </Button>
        </div>
        <div className='flex items-center gap-2 text-sm font-bold'>
          <MessageSquare className='h-4 w-4' />
          <span>{submission.num_comments}</span>
        </div>
        <Button
          variant='ghost'
          size='sm'
          className='flex items-center gap-2'
          onClick={copyLink}
        >
          <Link className='h-4 w-4' />
          <span className='hidden sm:block'>Share</span>
        </Button>
        <Button
          variant='ghost'
          size='sm'
          className={`flex items-center gap-2 ${
            saved ? 'text-orange-500' : ''
          }`}
          onClick={() => handleSave()}
        >
          <Bookmark className='h-4 w-4' />
          <span className='hidden sm:block'>{saved ? 'Saved' : 'Save'}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Post;
