/**
 * Compares two strings of semantic versions (semver) and check which one is greater;
 *  If the first is greater, returns 1, if the second is greater, returns -1, if both are equal, returns 0;
 * @since 0.5.0
 * @example
 *  compareSemver('1.2.0', '1.2.3') => -1
 *  compareSemver('1.2.5', '1.2.3') => 1
 *  compareSemver('1.2.5', '1.2.5') => 0
 */
export default function compareSemver(
  version1: string,
  version2: string
): number {
  const semverToNumber = (version: string): number => {
    return Number(
      version
        .split('.')
        .map((item: string) => item.padStart(2, '0'))
        .join('')
    );
  };

  const version1Number = semverToNumber(version1);
  const version2Number = semverToNumber(version2);

  if (version1Number > version2Number) {
    return 1;
  }

  if (version1Number < version2Number) {
    return -1;
  }

  return 0;
}
