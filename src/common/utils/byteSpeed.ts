import log from 'electron-log';
import formatBytes from './formatBytes';

/**
 * Returns a string describing data speed in bytes per seconds
 * @param size total byte size
 * @param timer total time span in milliseconds
 * @returns a string describing the byte speed (eg.: 458KB/s)
 * @since 0.4.0
 */
export default function byteSpeed(size: number, timer: number): string {
  try {
    return `${formatBytes(size / (timer / 1000))}/s`;
  } catch (error) {
    log.error(`byteSpeed -> Could not determine the byte speed: ${error}`);
    return '0 Bytes/s';
  }
}
