import log from 'electron-log';

interface TimeBlocksObject {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * transforms a given amount of seconds into a time block, in order to be used as a "time ago" string format
 * @example
 *  timeAgo(90) => { days: 0, hours: 0, minutes: 1, seconds: 30 }
 * @since 0.1.2
 */
export default function timeAgo(totalSeconds: number): TimeBlocksObject | null {
  try {
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
  } catch (error) {
    log.error(`timeAgo -> Could not determine past period: ${error}`);
    return null;
  }
}
