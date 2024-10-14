import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CommentSection from './CommentSection';
import { useViewContent } from '../providers/ViewContentProvider';
import Post from '../posts/Post';
import { Comment } from 'snoowrap';

const CollapsibleSideMenu = () => {
  const { viewContent } = useViewContent();
  const submission = viewContent?.submission;

  const [comments, setComments] = useState<Comment[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const sideMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sideMenuRef.current &&
        !sideMenuRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (submission) {
      submission?.fetch().then((r) => setComments(r.comments));
      setIsOpen(true);
    }
  }, [submission]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='relative h-full'>
      <Button
        ref={toggleButtonRef}
        variant='outline'
        size='icon'
        className='fixed top-1/2 right-0 z-50 transform -translate-y-1/2 rounded-l-full rounded-r-none h-20 w-6 shadow-lg'
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <ChevronRight className='h-4 w-4' />
        ) : (
          <ChevronLeft className='h-4 w-4' />
        )}
      </Button>
      <div
        ref={sideMenuRef}
        className={`fixed inset-y-0 right-0 w-full sm:w-2/3 xl:w-1/2 bg-background shadow-lg transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {submission ? (
          <div className='p-4'>
            <Post submission={submission} showTextContent />
            <Separator className='my-4' />
            <CommentSection
              comments={comments}
              submissionLink={'https://www.reddit.com' + submission?.permalink}
            />
          </div>
        ) : (
          <div className='h-full w-full flex flex-col items-center justify-center italic text-gray-400'>
            <span className='text-lg'>"Let's fight somewhere empty" - Goku</span>
            <span>Dragon Ball Series</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CollapsibleSideMenu
