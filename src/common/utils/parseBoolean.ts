export default function parseBoolean(strBool: never): boolean {
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
