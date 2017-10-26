import { put, take, select, SelectEffect, TakeEffect, PutEffect } from 'redux-saga/effects';
import { change, formValueSelector } from 'redux-form';

import { FORM_EMBED_RELATION, actionType } from './../consts';
import embed from './../actions/embed';

export default function (
  { form, relation }:
    { form: string, relation: { [relation: string]: string } }
) {
  return function* () {
    const relNames = Object.keys(relation);
    while (true) {
      const state = yield select();
      const selector = formValueSelector(form);
      const action = yield take('@@redux-form/CHANGE');
      if (action.meta && action.meta.form === form) {
        const rel = relNames.filter(r => action.meta.field === `${r}Id` || action.meta.field === `${r}Type`).map(r => ({
          relId: `${r}Id`,
          relType: `${r}Type`,
          relName: r,
          resource: relation[r],
        }))[0];
        if (rel) {
          const { resource, relId, relType, relName } = rel;
          if (action.meta.field === relId) {
            yield put(change(form, relId, action.payload))
            const data = yield select((state: any) => state.admin.resources[resource].data[action.payload]);
            yield put(change(form, relName, data));
          } else if (action.meta.field === relType/*  && action.payload !== selector(state, relType) */) {
            yield put(embed(relName, action.payload, form));
          }
        }
      }
    }
  }
}
