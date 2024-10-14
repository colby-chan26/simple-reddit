import { Subreddit } from 'snoowrap';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatNumberCompact } from '@/utils';
import React from 'react';

interface SearchbarItemProps {
  subreddit: Subreddit;
  onClick: React.MouseEventHandler;
}

const SearchbarItem = ({ subreddit, onClick }: SearchbarItemProps) => {
  return (
    <Button
      className='justify-start px-2 py-2 hover:bg-gray-200 cursor-pointer'
      variant='ghost'
      onClick={onClick}
    >
      <div className='flex flex-row gap-1'>
        <Avatar>
          <AvatarImage
            src={subreddit.icon_img || subreddit.community_icon}
            alt='User Avatar'
          />
          <AvatarFallback className='bg-slate-300'>r/</AvatarFallback>
        </Avatar>

        <div className='flex flex-col justify-start text-left'>
          <div>{subreddit.display_name}</div>
          <div className='text-xs'>{`${formatNumberCompact(
            subreddit.subscribers
          )} Members`}</div>
        </div>
      </div>
    </Button>
  );
};

export default SearchbarItem;
