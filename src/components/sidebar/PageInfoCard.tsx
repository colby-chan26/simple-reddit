import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useViewContent,
  PAGE_TYPES,
} from '@/components/providers/ViewContentProvider';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

const PAGE_TYPE_INFO = {
  [PAGE_TYPES.HOME]: {
    title: 'Home',
    description: 'Dive Into Anything!',
  },
  [PAGE_TYPES.SAVED]: {
    title: 'Saved',
    description: "Let's view that again!",
  },
  [PAGE_TYPES.POPULAR]: {
    title: 'Popular',
    description: 'I wonder what everyone else is up to?',
  },
  '': undefined,
};

const PageInfoCard = () => {
  const { viewContent } = useViewContent();
  const pageInfo = PAGE_TYPE_INFO[viewContent?.page ?? ''];

  if (!pageInfo) {
    return;
  }

  return (
    <Card className='border-2'>
      <CardHeader className='p-2'>
        <div className='w-full flex flex-col justify-center border-b-4 pt-0 pb-4'>
          <CardTitle className='text-[2em] leading-none pt-1 font-bold font-playwrite'>
            {pageInfo.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className='text-[clamp(.9rem,1vw,1rem)] h-fit p-3 pt-0'>
        <ScrollArea type='always' className='h-full'>
          <ScrollBar />
          <div className='text-gray-500 italic max-h-32 h-full w-[90%]'>
            {pageInfo.description}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PageInfoCard;
