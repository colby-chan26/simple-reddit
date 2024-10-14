/* eslint-disable @typescript-eslint/no-explicit-any */
import { Submission } from 'snoowrap';
import {
  GalleryContent,
  ImageContent,
  LinkContent,
  VideoContent,
} from './content-types';
import parseHTMLtoComponent from '@/utils/HTMLStringParser';

interface PostContentProps {
  submission: Submission;
  showTextContent?: boolean;
}

const PostContent = ({ submission, showTextContent }: PostContentProps) => {
  return (
    <div className='w-full'>
      {(() => {
        switch (submission.post_hint) {
          case 'hosted:video':
            return <VideoContent submission={submission} />;
          case 'link':
            return <LinkContent submission={submission} />;
          case 'image':
            return <ImageContent submission={submission} />;
          default:
        }
        if ((submission as any)['selftext_html'] && showTextContent) {
          return parseHTMLtoComponent((submission as any)['selftext_html']);
        }
        if ((submission as any)['is_gallery']) {
          return <GalleryContent submission={submission} />;
        }
        if ((submission as any)['poll_data']) {
          return <div className='text-red-400'>Polls Not Supported Yet!</div>;
        }
      })()}
    </div>
  );
};

export default PostContent;
