import { FORM_EMBED_RELATION } from './../consts';

export default (relname, type, form) => ({
  type: FORM_EMBED_RELATION,
  payload: {
    relname,
    type,
    form,
  }
});