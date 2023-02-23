/* eslint-disable @typescript-eslint/no-explicit-any */
import log from 'electron-log';

/**
 * Parses a numeric or integer value into a boolean value.
 * Will return false if it's a invalid value
 * @example
 *  parseBoolean('true') => true
 *  parseBoolean(0) => false
 *  parseBoolean('aaa') => false
 */
export default function parseBoolean(strBool: any): boolean {
  try {
    if (!['int', 'string'].includes(typeof strBool)) {
      return false;
    }

    if ([0, 'false', 'FALSE'].includes(strBool)) {
      return false;
    }

    if ([1, 'true', 'TRUE'].includes(strBool)) {
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
