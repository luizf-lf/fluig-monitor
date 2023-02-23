import parseBoolean from '../src/common/utils/parseBoolean';
import timeAgo from '../src/common/utils/timeAgo';

describe('Common util functions', () => {
  describe('Parse boolean util', () => {
    it('Should parse falsy values', () => {
      expect(parseBoolean('false')).toBeFalsy();
      expect(parseBoolean('FALSE')).toBeFalsy();
      expect(parseBoolean(0)).toBeFalsy();
    });
    it('Should parse truthy values', () => {
      expect(parseBoolean('true')).toBeTruthy();
      expect(parseBoolean('TRUE')).toBeTruthy();
      expect(parseBoolean(1)).toBeTruthy();
    });
    it('Should return falsy to unknown values', () => {
      expect(parseBoolean(null)).toBeFalsy();
      expect(parseBoolean(undefined)).toBeFalsy();
      expect(parseBoolean([1, 2, 3])).toBeFalsy();
      expect(parseBoolean('Sample value')).toBeFalsy();
    });
  });

  describe('Time ago util', () => {
    it('Should calculate seconds', () => {
      expect(timeAgo(35)).toHaveProperty('seconds', 35);
    });
    it('Should calculate minutes', () => {
      expect(timeAgo(130)).toHaveProperty('minutes', 2);
    });
    it('Should calculate hours', () => {
      expect(timeAgo(11000)).toHaveProperty('hours', 3);
    });
    it('Should calculate days', () => {
      expect(timeAgo(300000)).toHaveProperty('days', 3);
    });
  });
});
