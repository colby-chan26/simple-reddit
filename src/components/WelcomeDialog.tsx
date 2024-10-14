import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const WelcomeDialog = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hasSeenWelcomeModal');
    if (!hasSeenModal) {
      setShowModal(true);
    }
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    localStorage.setItem('hasSeenWelcomeModal', 'true');
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to Simple Reddit!</DialogTitle>
          <DialogDescription>
            This is a sample of my attempt to recreate a social platform!
          </DialogDescription>
        </DialogHeader>
        <span className='text-red-600'>As a sample, this it not intended for extended use! (due to rate limits)</span>
        <p className='py-2'>
          Feel free to explore the site! If you would like to learn how to host
          your own version of the application, check out the source code!
        </p>
        <a
          className='text-sm underline text-blue-600 hover:text-blue-800 visited:text-purple-600 w-[70%]'
          target='_blank'
          href='https://github.com/colby-chan26/simple-reddit'
        >
          https://github.com/colby-chan26/simple-reddit
        </a>
        <DialogFooter>
          <Button onClick={handleCloseModal}>Got it, thanks!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog;






