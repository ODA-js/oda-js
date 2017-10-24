import { SELECTOR_INIT } from './../consts';

export default (form: string, relation: { [relation: string]: string }) => () => ({
  type: SELECTOR_INIT,
  payload: {
    form,
    relation,
  }
});