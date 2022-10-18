/**
 * transforms a given amount of seconds into a "time ago" string format
 * @example
 *  timeAgo(1036800) => "12 days ago"
 * @since 0.1.2
 */
export default function timeAgo(seconds: number): string {
  if (!seconds) {
    throw new Error('seconds is required');
  }

  const fullMinutes = Math.floor(seconds / 60);
  const fullHours = Math.floor(seconds / 60 / 60);
  const fullDays = Math.floor(seconds / 60 / 60 / 24);
  const fullMonths = Math.floor(seconds / 60 / 60 / 24 / 30);
  const fullYears = Math.floor(seconds / 60 / 60 / 24 / 30 / 12);

  let remainingMonths = 0;
  let remainingDays = 0;
  let remainingHours = 0;
  let remainingMinutes = 0;
  let remainingSeconds = 0;

  if (fullYears > 0) {
    remainingMonths = fullMonths - fullYears * 12;
  }

  if (fullDays > 30) {
    remainingDays = fullDays - fullMonths * 30;
  }

  if (fullHours > 24) {
    remainingHours = fullHours - fullDays * 24;
  }

  if (fullMinutes > 60) {
    remainingMinutes = fullMinutes - fullHours * 60;
  }
  if (seconds > 60) {
    remainingSeconds = seconds - fullMinutes * 60;
  }

  console.log({
    seconds,
    fullMinutes,
    fullHours,
    fullDays,
    fullMonths,
    fullYears,
  });

  console.log({
    remainingSeconds,
    remainingMinutes,
    remainingHours,
    remainingDays,
    remainingMonths,
    fullYears,
  });

  return `${remainingMinutes}`;
}

// timeAgo(14852768);
timeAgo(61);
