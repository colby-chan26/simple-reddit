import { useEffect, useState } from 'react';
import Navbar from '@/components/header/Navbar';
import { useSnoowrap } from '@/components/providers/SnoowrapProvider';
import { initializeSnoowrap } from '@/auth/auth';
import { useRedditUser } from '@/components/providers/UserProvider';
import SideBar from '@/components/sidebar/Sidebar';
import CommentsView from './components/comments/CommentsView';
import Main from './components/feed/Main';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const { setSnoowrap } = useSnoowrap();
  const { setRedditUser } = useRedditUser();

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const getSnoowrap = async () => {
      const snoowrap = await initializeSnoowrap();
      setSnoowrap(snoowrap);

      try {
        snoowrap
          ?.getMe()
          .fetch()
          .then((r) => setRedditUser(r));
      } catch (e) {
        console.error(e);
      }
    };

    getSnoowrap();
  }, [setRedditUser, setSnoowrap]);

  return (
    <div className='bg-slate-100 font-cabin flex flex-col min-h-screen'>
      <div>
        <Navbar screenWidth={screenWidth}/>
      </div>
      <div className='flex-grow h-[90vh] flex flex-row'>
        {screenWidth > 640 && (
          <div className='w-full min-w-48 max-w-[20%] xl:max-w-[17.5%]'>
            <SideBar screenWidth={screenWidth}/>
          </div>
        )}
        <div className='w-full h-full sm:max-w-[90%] md:max-w-[60%] xl:max-w-[65%]'>
          <Main />
        </div>
        <CommentsView />
      </div>
      <Toaster/>
    </div>
  );
}

export default App;
