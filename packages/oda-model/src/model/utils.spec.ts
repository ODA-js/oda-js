import { TransformArgs } from './utils';

describe('transform Fields', () => {
  let transform = TransformArgs();
  it('transform', () => {
    const result = transform.transform([
      { name: 'one'},
      { name: 'two', required: true },
      { name: 'three', required: false, defaultValue: '3' },
      { name: 'four', required: false, defaultValue: '3', type: 'Number' },
    ]);
    expect(result.has('one'));
    expect(result.has('two'));
    expect(result.has('three'));
    expect(result.has('four'));
    expect(result.get('one').defaultValue).toBeNull();
    expect(result.get('one').required).toBeNull();
    expect(result.get('one').type).toBeNull();
  });
});
