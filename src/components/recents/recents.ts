import { Subreddit } from 'snoowrap';

export interface Recent {
  subredditImgUrl: string;
  displayName: string;
  name: string;
}

export const RECENTS_UPDATED_EVENT = 'recents_updated';

export const getRecents = (): Recent[] => {
  return JSON.parse(sessionStorage.getItem('recents') ?? '[]');
};

let recents: Recent[] = getRecents() ?? [];

export const rearrangeRecents = (clickedRecentItem: Recent) => {
  recents = recents.filter(
    (recentItem) => recentItem.name !== clickedRecentItem.name
  );
  recents.unshift(clickedRecentItem);
  sessionStorage.setItem('recents', JSON.stringify(recents));
  window.dispatchEvent(new Event(RECENTS_UPDATED_EVENT));
};

export const addToRecent = (subreddit: Subreddit) => {
  if (recents.length >= 5) {
    recents.pop();
  }
  recents = recents.filter(
    (recentItem) => recentItem.name !== subreddit.display_name
  );
  const recentItem = {
    subredditImgUrl: subreddit.icon_img || subreddit.community_icon,
    displayName: subreddit.display_name_prefixed,
    name: subreddit.display_name,
  };
  recents.unshift(recentItem);
  sessionStorage.setItem('recents', JSON.stringify(recents));
  window.dispatchEvent(new Event(RECENTS_UPDATED_EVENT));
};
