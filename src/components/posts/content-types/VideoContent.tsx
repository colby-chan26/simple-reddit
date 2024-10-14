import ReactPlayer from 'react-player';
import { Submission } from 'snoowrap';

export const VideoContent = ({submission}: {submission: Submission}) => (
  <div className='flex items-center justify-center w-auto h-auto max-w-full max-h-[32rem] pt-[56.25%]'>
    <ReactPlayer
      url={submission.secure_media?.reddit_video?.hls_url}
      controls={true}
      width='100%'
      height='100%'
      style={{ position: 'absolute', top: 0, left: 0 }}
    />
  </div>
);