import parseBoolean from '../../src/common/utils/parseBoolean';
import relativeTime from '../../src/common/utils/relativeTime';
import formatBytes from '../../src/common/utils/formatBytes';
import byteSpeed from '../../src/common/utils/byteSpeed';
import compareSemver from '../../src/common/utils/compareSemver';

describe('Common util functions', () => {
  describe('Parse boolean util', () => {
    it('Parses falsy values', () => {
      expect(parseBoolean('false')).toBeFalsy();
      expect(parseBoolean('FALSE')).toBeFalsy();
      expect(parseBoolean(0)).toBeFalsy();
    });
    it('Parses truthy values', () => {
      expect(parseBoolean('true')).toBeTruthy();
      expect(parseBoolean('TRUE')).toBeTruthy();
      expect(parseBoolean(1)).toBeTruthy();
    });
    it('Returns false to unknown values', () => {
      expect(parseBoolean(null)).toBeFalsy();
      expect(parseBoolean(undefined)).toBeFalsy();
      expect(parseBoolean([1, 2, 3])).toBeFalsy();
      expect(parseBoolean('Sample value')).toBeFalsy();
    });
  });

  describe('Relative time util', () => {
    it('Calculates seconds', () => {
      expect(relativeTime(35)).toHaveProperty('seconds', 35);
    });
    it('Calculates minutes', () => {
      expect(relativeTime(130)).toHaveProperty('minutes', 2);
    });
    it('Calculates hours', () => {
      expect(relativeTime(11000)).toHaveProperty('hours', 3);
    });
    it('Calculates days', () => {
      expect(relativeTime(300000)).toHaveProperty('days', 3);
    });
  });

  describe('Format data size util', () => {
    it('Formats common data sizes', () => {
      expect(formatBytes(1)).toBe('1 Bytes');
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(1048576)).toBe('1 MB');
      expect(formatBytes(1073741824)).toBe('1 GB');
      expect(formatBytes(1099511627776)).toBe('1 TB');
      expect(formatBytes(1125899906842624)).toBe('1 PB');
    });
  });

  describe('Bytes per seconds util', () => {
    it('Calculates data speed', () => {
      expect(byteSpeed(1024, 1000)).toBe('1 KB/s');
      expect(byteSpeed(1048576, 1000)).toBe('1 MB/s');
    });
  });

  describe('Compare semantic version util', () => {
    it('Compares versions correctly', () => {
      expect(compareSemver('1.7.0', '1.6.5')).toBe(1);
      expect(compareSemver('1.6.1', '1.6.5')).toBe(-1);
      expect(compareSemver('1.8.0', '1.8.0')).toBe(0);
      expect(compareSemver('1.8.0', '1.7.1')).toBe(1);
      expect(compareSemver('1.5.7', '1.5.14')).toBe(-1);
    });
  });
});
