import { restart } from './restart';

describe('restart', () => {
  it('throws ModelLevel', () => {
    expect(() => restart('model')).toThrowError('model');
  });
  it('throws PackageLevel', () => {
    expect(() => restart('package')).toThrowError('package');
  });
  it('throws EntityLevel', () => {
    expect(() => restart('entity')).toThrowError('entity');
  });
  it('throws FieldLevel', () => {
    expect(() => restart('field')).toThrowError('field');
  });
  it('throws RelationLevel', () => {
    expect(() => restart('relation')).toThrowError('relation');
  });
  it('throws MutationLevel', () => {
    expect(() => restart('mutation')).toThrowError('mutation');
  });
  it('throws EnumLevel', () => {
    expect(() => restart('enum')).toThrowError('enum');
  });
  it('throws EnumLevel', () => {
    expect(() => restart('new!one' as any)).toThrowError('unknown');
  });
});

