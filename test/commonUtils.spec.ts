import parseBoolean from '../src/common/utils/parseBoolean';

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
});
