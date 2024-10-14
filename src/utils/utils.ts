const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short',
  minimumSignificantDigits: 3,
  maximumSignificantDigits: 3,
})
export const formatNumberCompact = (num: number): string => {
  if (num < 1000) {
    return num.toString();
  }
  return compactFormatter.format(num);
};

const commaformatter = new Intl.NumberFormat('en-US');
export const formatNumberWithCommas = (num: number): string => {
  return commaformatter.format(num);
}

export const timeSince = (timeInSeconds: number): string => {
  const currentTime = Date.now();
  const diffInMs = currentTime - timeInSeconds * 1000;

  const msInMinute = 60 * 1000;
  const msInHour = 60 * msInMinute;
  const msInDay = 24 * msInHour;
  const msInYear = 365.25 * msInDay;  // Taking leap years into account

  let timeAgo: number;
  let unit: string;

  if (diffInMs < msInHour) {
      timeAgo = Math.round(diffInMs / msInMinute);
      unit = timeAgo === 1 ? "minute" : "minutes";
  } else if (diffInMs < msInDay) {
      timeAgo = Math.round(diffInMs / msInHour);
      unit = timeAgo === 1 ? "hour" : "hours";
  } else if (diffInMs < msInYear) {
      timeAgo = Math.round(diffInMs / msInDay);
      unit = timeAgo === 1 ? "day" : "days";
  } else {
      timeAgo = Math.round(diffInMs / msInYear);
      unit = timeAgo === 1 ? "year" : "years";
  }

  return `${timeAgo} ${unit} ago`;
}