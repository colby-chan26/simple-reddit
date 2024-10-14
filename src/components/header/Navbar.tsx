import { useState, useRef, useEffect } from 'react';
import { BookUser, Menu, X } from 'lucide-react';
import SearchBar from './Searchbar';
import SideBar from '../sidebar/Sidebar';
import ButtonBar from '../ButtonBar';
import { logout } from '@/auth/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRedditUser } from '../providers/UserProvider';
import { Button } from '@/components/ui/button';
import { handleAuthorization } from '@/auth/auth';

const Navbar = ({ screenWidth }: { screenWidth: number }) => {
  const { redditUser } = useRedditUser();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='pt-2 pb-3 px-6 grid grid-cols-[20%_60%_20%] items-center'>
      <div className='flex items-center w-fit text-lg'>
        {/* Mobile View */}
        {screenWidth < 640 && (
          <button
            onClick={toggleMenu}
            className='inline-flex items-center justify-center rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
            aria-expanded={isOpen}
          >
            <span className='sr-only'>Open main menu</span>
            {isOpen ? (
              <X className='block h-6 w-6' aria-hidden='true' />
            ) : (
              <Menu className='block h-6 w-6' aria-hidden='true' />
            )}
          </button>
        )}
        <a href='https://github.com/colby-chan26/simple-reddit' target='_blank'><BookUser size={30} /></a>
        <div className='hidden lg:block'>Simple Reddit</div>
      </div>

      <SearchBar />

      <div className='w-full flex flex-row gap-2 justify-end'>
        {screenWidth > 1024 && <ButtonBar />}
        {redditUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger className='focus:outline-none'>
              <Avatar className='border'>
                <AvatarImage src={redditUser?.icon_img} alt='User Avatar' />
                <AvatarFallback className='text-black'>u/</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{redditUser?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant='secondary'
            className='bg-white rounded-full hover:bg-slate-300'
            onClick={handleAuthorization}
          >
            Sign In
          </Button>
        )}
      </div>

      {/* Overlay */}
      {isOpen && screenWidth < 640 && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-[60] md:hidden'
          aria-hidden='true'
        />
      )}

      {/* Mobile menu */}
      {screenWidth < 640 && (
        <div
          ref={menuRef}
          className={`
          fixed top-0 left-0 h-full w-56 bg-slate-100 z-[70] shadow-lg transform transition-transform duration-300 ease-in-out py-3
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:hidden
        `}
        >
          <SideBar screenWidth={screenWidth}/>
        </div>
      )}
    </div>
  );
};

export default Navbar;
