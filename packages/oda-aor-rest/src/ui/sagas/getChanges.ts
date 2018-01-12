import { change, formValueSelector } from 'redux-form';
import { put, select, take, SelectEffect, TakeEffect, PutEffect } from 'redux-saga/effects';

import embed from './../actions/embed';

export default function (
  { form, relation }:
    {
      form: string, relation: {
        [relation: string]: {
          resource: string;
          single: boolean;
        }
      }
    }
) {
  return function* () {
    const relNames = Object.keys(relation);
    while (true) {
      const selector = formValueSelector(form);
      const action = yield take('@@redux-form/CHANGE');
      if (action.meta && action.meta.form === form) {
        const rel = relNames.filter(r =>
          action.meta.field.match(`${r}Id`) ||
          (action.meta.field.match(`${r}Values`) && action.meta.field.match(`].id`)) ||
          action.meta.field.match(`${r}Type`)
        )
          .map(r => ({
            relId: `${r}Id`,
            relType: `${r}Type`,
            relValues: `${r}Values`,
            relName: r,
            resource: relation[r].resource,
            single: relation[r].single,
          }))[0];
        if (rel) {
          const { resource, relId, relType, relName, single, relValues } = rel;

          if (action.meta.field.match(relId) || (action.meta.field.match(relValues) && action.meta.field.match(`].id`))) {
            const data = yield select((state: any) => state.admin.resources[resource].data[action.payload]);
            const state = yield select();

            const root = single ? relName : action.meta.field.replace(`.${action.meta.field.match(relId) ? relId : 'id'}`, '');
            yield put(change(form, root, {
              ...selector(state, root),
              ...data,
            }));
          } else if (action.meta.field.match(relType) /*  && action.payload !== selector(state, relType) */) {
            const root = single ? relName : action.meta.field.replace(`.${relType}`, '');
            yield put(embed(relName, action.payload, form));
            let state = yield select();
            yield put(change(form, root, selector(state, root)))
            state = yield select();
            const id = selector(state, single ? relId : action.meta.field.replace(`${relType}`, 'id'));
            const data = yield select((state: any) => state.admin.resources[resource].data[id]);
            state = yield select();
            yield put(change(form, root, {
              ...selector(state, root),
              ...data,
            }));
          }
        }
      }
    }
  }
}
