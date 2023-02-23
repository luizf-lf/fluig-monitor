/* eslint-disable @typescript-eslint/no-explicit-any */
import log from 'electron-log';

/**
 * Parses a numeric or string value into a boolean value.
 * Will return false to unknown values;
 * @example
 *  parseBoolean('true') => true
 *  parseBoolean(0) => false
 *  parseBoolean('sample') => false
 */
export default function parseBoolean(source: any): boolean {
  try {
    if (!['number', 'string'].includes(typeof source)) {
      return false;
    }

    if ([0, 'false', 'FALSE'].includes(source)) {
      return false;
    }

    if ([1, 'true', 'TRUE'].includes(source)) {
      return true;
    }

    return false;
  } catch (error) {
    log.error(
      `parseBoolean -> Could not parse the non boolean value: ${error}`
    );
    return false;
  }
}
