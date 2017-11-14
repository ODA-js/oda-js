import { FORM_EMBED_RELATION } from './../consts';
import { take, put, select, TakeEffect, PutEffect, SelectEffect } from 'redux-saga/effects';
import { change, formValueSelector } from 'redux-form';
import { actionType } from './../consts';

export default function ({ form }) {
  return function* () {
    while (true) {
      const action = yield take(FORM_EMBED_RELATION);
      const state = yield select();
      const selector = formValueSelector(form);
      const rel = action.payload.relname;
      const relId = rel + 'Id';
      yield put(change(form, rel, null));
      yield put(change(form, relId, selector(state, relId)));
    }
  }
}