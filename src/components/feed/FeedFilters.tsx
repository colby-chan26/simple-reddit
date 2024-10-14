import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Flame,
  TrendingUp,
  Clock,
  ArrowUpCircle,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export enum FILTER_TYPES {
  HOT = 'hot',
  RISING = 'rising',
  NEW = 'new',
  TOP = 'top',
}

export enum TOP_TIMES {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  ALL = 'all',
}

const filters = [
  { id: FILTER_TYPES.HOT, label: 'Hot', icon: Flame },
  { id: FILTER_TYPES.RISING, label: 'Rising', icon: ArrowUpCircle },
  { id: FILTER_TYPES.NEW, label: 'New', icon: Clock },
];

const topTimeFrames = [
  { id: TOP_TIMES.HOUR, label: 'Past Hour' },
  { id: TOP_TIMES.DAY, label: 'Past 24 Hours' },
  { id: TOP_TIMES.WEEK, label: 'Past Week' },
  { id: TOP_TIMES.MONTH, label: 'Past Month' },
  { id: TOP_TIMES.YEAR, label: 'Past Year' },
  { id: TOP_TIMES.ALL, label: 'All Time' },
];

interface FeedFilterProps {
  onClick: (activeFilter: FILTER_TYPES, time?: TOP_TIMES) => void;
  activeFilter: FILTER_TYPES
}

const FeedFilters = ({ onClick, activeFilter }: FeedFilterProps) => {
  const [topTimeFrame, setTopTimeFrame] = useState<TOP_TIMES | undefined>();

  return (
    <div className='flex flex-wrap gap-2 bg-background rounded-full shadow-sm mx-4 w-full max-w-3xl'>
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? 'default' : 'ghost'}
          size='sm'
          onClick={() => {
            setTopTimeFrame(undefined);
            onClick(filter.id);
          }}
          className={`flex items-center space-x-1 rounded-full hover:bg-slate-300 ${activeFilter === filter.id ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}`}
        >
          <filter.icon className='w-4 h-4' />
          <span>{filter.label}</span>
        </Button>
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={activeFilter === 'top' ? 'default' : 'ghost'}
            size='sm'
            className={`flex items-center space-x-1 rounded-full hover:bg-slate-300 ${activeFilter === FILTER_TYPES.TOP ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}`}
          >
            <TrendingUp className='w-4 h-4' />
            <span>Top</span>
            <ChevronDown className='w-4 h-4 ml-1' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {topTimeFrames.map((timeFrame) => (
            <DropdownMenuItem
              className={topTimeFrame === timeFrame.id ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}
              key={timeFrame.id}
              onClick={() => {
                setTopTimeFrame(timeFrame.id);
                onClick(FILTER_TYPES.TOP, timeFrame.id);
              }}
            >
              {timeFrame.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {activeFilter === 'top' && topTimeFrame && (
        <span className='hidden sm:block text-sm text-muted-foreground self-center ml-2'>
          {topTimeFrames.find((tf) => tf.id === topTimeFrame)?.label}
        </span>
      )}
    </div>
  );
};

export default FeedFilters;
