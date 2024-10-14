import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSnoowrap } from '@/components/providers/SnoowrapProvider';
import debounce from 'lodash/debounce';
import Snoowrap, { Subreddit } from 'snoowrap';
import SearchbarItem from './SearchbarItem';
import { useViewContent } from '@/components/providers/ViewContentProvider';
import { addToRecent } from '@/components/recents';

const fetchSubreddits = async (
  query: string,
  snoowrap: Snoowrap | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _signal: AbortSignal
): Promise<Subreddit[]> => {
  if (!snoowrap) {
    return [];
  }

  try {
    const subreddits = await snoowrap.searchSubreddits({
      limit: 6,
      query,
    });
    return subreddits.filter(
      (subreddit) => subreddit.subreddit_type === 'public'
    );
  } catch (e) {
    console.error(e);
  }

  return [];
};

const Searchbar = () => {
  const { snoowrap } = useSnoowrap();
  const { setViewContent } = useViewContent();
  const [query, setQuery] = useState('');
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      if (value.length === 0) {
        setSubreddits([]);
        setIsDropdownVisible(false);
        return;
      }

      setIsLoading(true);
      setIsDropdownVisible(true);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      try {
        const results = await fetchSubreddits(value, snoowrap, signal);
        if (!signal.aborted) {
          setSubreddits(results);
        }
      } catch (error) {
        if (!signal.aborted) {
          console.error('Search error:', error);
          setSubreddits([]);
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 300),
    [snoowrap]
  );

  useEffect(() => {
    debouncedSearch(query);

    return () => {
      debouncedSearch.cancel();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, debouncedSearch]);

  const onItemClick = useCallback(
    (subreddit: Subreddit) => () => {
      setViewContent({ subreddit });
      setIsDropdownVisible(false);
      setQuery('');
      addToRecent(subreddit);
    },
    [setViewContent]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDropdownVisible(false);
    }
  }, []);

  return (
    <div className='relative w-full max-w-[600px] mx-auto' onBlur={handleBlur}>
      <div className='relative'>
        <Input
          type='text'
          placeholder='Find a Subreddit'
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsDropdownVisible(query.length > 0)}
          className='pr-10 rounded-full'
          aria-label='Search'
          aria-autocomplete='list'
          aria-controls='search-dropdown'
          aria-expanded={isDropdownVisible}
        />
        <Button
          size='icon'
          variant='ghost'
          className='absolute right-0 top-0 h-full rounded-full'
          aria-label='Search'
        >
          <Search className='h-4 w-4' />
        </Button>
      </div>
      {isDropdownVisible && (
        <div className='absolute z-20 mt-1 w-full bg-white border max-h-65 border-gray-200 rounded-lg'>
          <ScrollArea id='search-dropdown' className='shadow-lg rounded-lg'>
            {isLoading ? (
              <p className='p-4 text-sm text-gray-500'>Loading...</p>
            ) : subreddits.length > 0 ? (
              <div className='h-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-2 gap-1 max-h-65'>
                {subreddits.map((item, index) => (
                  <SearchbarItem
                    key={index}
                    onClick={onItemClick(item)}
                    subreddit={item}
                  />
                ))}
              </div>
            ) : (
              <p className='italic p-4 text-sm text-gray-500'>
                No results found
              </p>
            )}
            <ScrollBar orientation='vertical' />
          </ScrollArea>
        </div>
      )}

      {isDropdownVisible && (
        <div
          className='fixed inset-0 bg-opacity-50 z-10'
          aria-hidden='true'
        />
      )}
    </div>
  );
};

export default Searchbar;
