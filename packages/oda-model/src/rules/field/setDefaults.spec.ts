import Rule from './setDefaults';
import { Field } from '../../model/Field';

describe('setDefaults', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('fix simple field', () => {
    const field = new Field({
      name: 'user',
    });
    expect(field).toMatchSnapshot();
    const result = rule.validate({
      field: field,
    } as any);
    expect(result).toMatchSnapshot();
    expect(field).toMatchSnapshot();
  });

  it('fix indexed field', () => {
    const field = new Field({
      name: 'user',
      indexed: true,
    });
    expect(field).toMatchSnapshot();
    const result = rule.validate({
      field: field,
    } as any);
    expect(result).toMatchSnapshot();
    expect(field).toMatchSnapshot();
  });

  it('fix identity field', () => {
    const field = new Field({
      name: 'user',
      identity: true,
    });
    expect(field).toMatchSnapshot();
    const result = rule.validate({
      field: field,
    } as any);
    expect(result).toMatchSnapshot();
    expect(field).toMatchSnapshot();
  });

  it('fix derived field', () => {
    const field = new Field({
      name: 'user',
      derived: true,
    });
    expect(field).toMatchSnapshot();
    const result = rule.validate({
      field: field,
    } as any);
    expect(result).toMatchSnapshot();
    expect(field).toMatchSnapshot();
  });

  it('fix persistend-derived field', () => {
    const field = new Field({
      name: 'user',
      derived: true,
    });
    expect(field).toMatchSnapshot();
    const result = rule.validate({
      field: field,
    } as any);
    expect(result).toMatchSnapshot();
    expect(field).toMatchSnapshot();
  });

});
