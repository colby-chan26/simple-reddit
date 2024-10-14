import { ExternalLink } from "lucide-react";
import { Submission } from "snoowrap";

export const LinkContent = ({submission}: {submission: Submission}) => (
  <div className='flex justify-between'>
    <a
      className='text-xs underline text-blue-600 hover:text-blue-800 visited:text-purple-600 w-[70%]'
      target='_blank'
      href={submission.url}
    >
      {submission.url}
    </a>
    <a target='_blank' href={submission.url} className='relative'>
      <img
        src={submission.thumbnail}
        alt='Link content placeholder'
        className='w-auto h-auto max-w-full max-h-[32rem] rounded-md'
      />
      <ExternalLink className='backdrop-blur-3xl rounded-lg absolute bottom-0 left-0 text-white' />
    </a>
  </div>
);
