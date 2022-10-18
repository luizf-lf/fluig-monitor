/**
 * transforms a given amount of seconds into a "time ago" string format
 * @example
 *  timeAgo(1036800) => "12 days ago"
 * @since 0.1.2
 */
export default function timeAgo(totalSeconds: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  if (!totalSeconds) {
    throw new Error('totalSeconds is required');
  }

  /**
   * minutes to seconds = 60
   * hours to seconds = 3600
   * days to seconds = 86400
   */

  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (totalSeconds >= 60) {
    minutes = Math.floor(totalSeconds / 60);
    seconds = totalSeconds - minutes * 60;

    if (minutes >= 60) {
      hours = Math.floor(minutes / 60);
      minutes -= hours * 60;

      if (hours >= 24) {
        days = Math.floor(hours / 24);
        hours -= days * 24;
      }
    }
  } else {
    seconds = totalSeconds;
  }

  return { days, hours, minutes, seconds };
}
