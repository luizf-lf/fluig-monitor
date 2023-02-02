/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Parses a numeric or integer value into a boolean value.
 * Will return false if it's a invalid value
 * @example
 *  parseBoolean('true') => true
 *  parseBoolean(0) => false
 *  parseBoolean('aaa') => false
 */
export default function parseBoolean(strBool: any): boolean {
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
}
