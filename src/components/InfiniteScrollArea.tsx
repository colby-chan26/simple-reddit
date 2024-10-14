import { useCallback, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollAreaProps<T> {
  items: T[];
  loadMoreItems: () => Promise<void>;
  loading: boolean;
  createItem: (item: T) => JSX.Element;
  containerStyles?: string;
}

const InfiniteScrollArea = <T,>({
  items,
  loadMoreItems,
  loading,
  createItem,
  containerStyles,
}: InfiniteScrollAreaProps<T>) => {
  const observerRef = useRef<IntersectionObserver>();

  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loading) {
            loadMoreItems();
          }
        },
        { threshold: 0.1 }
      );
      if (node) observerRef.current.observe(node);
    },
    [loadMoreItems, loading]
  );

  return (
    <ScrollArea>
      <div className={containerStyles ?? 'h-full w-full flex flex-col gap-y-5 pr-3'}>
        {items && items.map(createItem)}
        {/* Intersection observer target for infinite scrolling */}
        <div
          ref={lastPostRef}
          className='h-fit flex items-center justify-center'
        >
          {loading && <Loader2 className='h-6 w-6 animate-spin' />}
        </div>
      </div>
    </ScrollArea>
  );
};

export default InfiniteScrollArea;
