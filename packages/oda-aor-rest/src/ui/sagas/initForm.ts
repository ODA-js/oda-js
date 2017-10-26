import { FORM_EMBED_RELATION } from './../consts';
import { take, put, select, TakeEffect, PutEffect, SelectEffect } from 'redux-saga/effects';
import { change, formValueSelector } from 'redux-form';
import { actionType } from './../consts';

export default function ({ form, relation }) {
  const relNames = Object.keys(relation);
  return function* () {
    while (true) {
      const action = yield take('@@redux-form/INITIALIZE');
      for (let i = 0, len = relNames.length; i < len; i++) {
        yield put(change(form, `${relNames[i]}Type`, actionType.USE));
      }
    }
  }
}