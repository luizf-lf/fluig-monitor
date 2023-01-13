import formatBytes from './formatBytes';

/**
 * Return a byte speed in bytes per seconds
 * @param size total byte size
 * @param timer total time span in milliseconds
 * @returns a string describing the byte speed (eg.: 458KB/s)
 * @since 0.4.0
 */
export default function byteSpeed(size: number, timer: number): string {
  return `${formatBytes(size / (timer / 1000))}/s`;
}
