import { Button } from '@/components/ui/button';
import {
  StickyNote,
  MessageCircle
} from 'lucide-react';

export enum FILTER_TYPES {
  SUBMISSIONS = 'Submissions',
  COMMENTS = 'Comments',
}

const filters = [
  { id: FILTER_TYPES.SUBMISSIONS, label: 'Submissions', icon: StickyNote },
  { id: FILTER_TYPES.COMMENTS, label: 'Comments', icon: MessageCircle },
];

interface FeedFilterProps {
  onClick: (activeFilter: FILTER_TYPES) => void;
  activeFilter: FILTER_TYPES
}

const FeedFilters = ({ onClick, activeFilter }: FeedFilterProps) => {
  return (
    <div className='flex flex-wrap gap-2 bg-background rounded-full shadow-sm mx-4 w-full max-w-3xl'>
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? 'default' : 'ghost'}
          size='sm'
          onClick={() => {
            onClick(filter.id);
          }}
          className={`flex items-center space-x-1 rounded-full hover:bg-slate-300 ${activeFilter === filter.id ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}`}
        >
          <filter.icon className='w-4 h-4' />
          <span>{filter.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default FeedFilters;