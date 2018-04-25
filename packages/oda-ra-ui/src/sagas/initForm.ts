import { change, formValueSelector } from 'redux-form';
import { put, select, take } from 'redux-saga/effects';

import { actionType } from './../consts';

export default function ({ form, relation }: {
  form: string, relation: {
    [key: string]: {
      resource: string;
      single: boolean;
    } | string
  }
}) {
  const relNames = Object.keys(relation);
  return function* () {
    while (true) {
      const action = yield take('@@redux-form/INITIALIZE');
      const state = yield select();
      const selector = formValueSelector(form);
      if (action.meta && action.meta.form === form) {
        for (let i = 0, len = relNames.length; i < len; i++) {
          if (typeof relation[relNames[i]] == 'string') {
            yield put(change(form, `${relNames[i]}Type`, actionType.USE));
          } else if (typeof relation[relNames[i]] === 'object') {
            const list = yield selector(state, `${relNames[i]}Values`);
            if (list) {
              const data = list.map(item => ({
                ...item,
                [`${relNames[i]}Type`]: actionType.USE,
              }));
              yield put(change(form, `${relNames[i]}Values`, data));
            }
          }
        }
      }
    }
  }
}