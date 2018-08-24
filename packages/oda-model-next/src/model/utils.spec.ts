import 'jest';
import { TransformArgs, TransformRef } from './utils';

describe('transform Fields', () => {
  let transform = TransformArgs();
  it('transform', () => {
    const result = transform.transform([
      { name: 'one' },
      { name: 'two', required: true },
      { name: 'three', required: false, defaultValue: '3' },
      { name: 'four', required: false, defaultValue: '3', type: 'Number' },
    ]);
    expect(result).toMatchSnapshot();
    const result2 = transform.reverse(result);
    expect(result2).toMatchSnapshot();
  });
  it('transform hash', () => {
    const result = transform.transform({
      one: {},
      two: { required: true },
      three: { required: false, defaultValue: '3' },
      four: { required: false, defaultValue: '3', type: 'Number' },
    });
    expect(result).toMatchSnapshot();
    const result2 = transform.reverse(result);
    expect(result2).toMatchSnapshot();
  });
});

describe('transform Ref', () => {
  let transform = TransformRef();
  it('transform', () => {
    const result = transform.transform('local@Entity#id');
    expect(result).toMatchSnapshot();
    const result2 = transform.reverse(result);
    expect(result2).toMatchSnapshot();
    const result3 = transform.transform(result2);
    expect(result3).toMatchSnapshot();
  });
});
