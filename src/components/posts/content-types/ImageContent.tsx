import { Submission } from 'snoowrap';
import { ImagePreviewSource } from 'snoowrap/dist/objects/Submission';

const CONTAINER_WIDTH = 600;
const CONTIANER_HEIGHT = 512;

const findBestFit = (images: ImagePreviewSource[]): string | undefined => {
  if (!images) {
    return;
  }
  for (const image of images) {
    if (image.height >= CONTIANER_HEIGHT || image.width >= CONTAINER_WIDTH) {
      return image.url;
    }
  }
};

export const ImageContent = ({ submission }: { submission: Submission }) => {
  const images = submission.preview.images[0].resolutions;

  const url = findBestFit(images) ?? submission.url;

  return (
    <div className='flex items-center justify-center'>
      <a href={submission.url} target='_blank'>
        <img
          src={url}
          alt='Image Placeholder'
          className='w-auto h-auto max-w-full max-h-[32rem] rounded-md'
        />
      </a>
    </div>
  );
};
