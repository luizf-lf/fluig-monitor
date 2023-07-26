import log from 'electron-log';

/* eslint-disable no-restricted-properties */
/**
 * Formats a giver number of bytes to a human readable format.
 * @since 0.2
 * @param bytes number of bytes to format
 * @param decimals amount of decimals to use (defaults to 2)
 * @returns a string containing the formatted bytes in human readable format
 * @example formatBytes(1073741824) -> "1 GB"
 */
export default function formatBytes(
  bytes: number | null,
  decimals = 2
): string {
  try {
    if (!bytes || !+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  } catch (error) {
    log.error(`formatBytes -> Could not format bytes: ${error}`);
    return '0 Bytes';
  }
}
