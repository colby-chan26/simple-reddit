import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { BookMarked, House, Rocket } from 'lucide-react';
import { useRedditUser } from './providers/UserProvider';
import { Separator } from './ui/separator';
import { PAGE_TYPES, useViewContent } from './providers/ViewContentProvider';

const ButtonBar = () => {
  const { redditUser } = useRedditUser();
  const { setViewContent } = useViewContent();

  const onPageClick = useCallback(
    (page: PAGE_TYPES) => {
      setViewContent({ page });
    },
    [setViewContent]
  );

  return (
    <div className='w-fit flex flex-row text-xl gap-3'>
      <div className='bg-white rounded-full flex flex-row gap-1 items-center text-l'>
        <Button
          variant='ghost'
          size='icon'
          className='rounded-full hover:bg-slate-300'
          onClick={() => onPageClick(PAGE_TYPES.HOME)}
        >
          <House className='h-5 w-5' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='rounded-full hover:bg-slate-300'
          onClick={() => onPageClick(PAGE_TYPES.POPULAR)}
        >
          <Rocket className='h-5 w-5' />
        </Button>
        <Separator className='h-[75%]' orientation='vertical' />
        {redditUser && (
          <Button
            variant='ghost'
            size='icon'
            className='rounded-full hover:bg-slate-300'
            onClick={() => onPageClick(PAGE_TYPES.SAVED)}
          >
            <BookMarked className='h-5 w-5' />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ButtonBar;
