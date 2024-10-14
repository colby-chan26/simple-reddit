/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useMemo } from 'react';
import { Submission } from 'snoowrap';

const CONTAINER_WIDTH = 600;
const CONTIANER_HEIGHT = 512;

const findBestFit = (imageSizes: any): string | undefined => {
  if (!imageSizes?.length) {
    return;
  }
  for (const size of imageSizes) {
    if (size.y >= CONTIANER_HEIGHT || size.x >= CONTAINER_WIDTH) {
      return size.u;
    }
  }

  return imageSizes.at(-1).u;
};

const processMediaMetaData = (submission: Submission) => {
  const metadata = (submission as any)?.media_metadata;
  if (!metadata) {
    return;
  }
  const images = Object.values(metadata);
  return images.map((imageMetadata: any) => {
    return findBestFit(imageMetadata.p);
  });
};

export const GalleryContent = ({ submission }: { submission: Submission }) => {
  const imageUrls = useMemo(
    () => processMediaMetaData(submission),
    [submission]
  );
  if (!imageUrls) {
    return;
  }

  return (
    <div className='flex items-center justify-center'>
      <Carousel className='w-full max-w-[80%]'>
        <CarouselContent>
          {imageUrls.map((imageUrl) => (
            <CarouselItem
              key={imageUrl}
              className=' bg-slate-400 flex justify-center items-center'
            >
              <a href={submission.url} target='_blank'>
                <img
                  src={imageUrl}
                  alt='Image Placeholder'
                  className='w-auto h-auto max-w-full max-h-[32rem] rounded-md'
                />
              </a>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
