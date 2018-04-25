import { call, race, take, TakeEffect, RaceEffect } from 'redux-saga/effects';

import { SELECTOR_CLEAR, SELECTOR_INIT } from './../consts';
import getEmbedForm from './embedForm';
import getChanges from './getChanges';
import getInitForm from './initForm';

export default function* () {
  while (true) {
    const action = yield take(SELECTOR_INIT);
    const changes = getChanges(action.payload);
    const embedForm = getEmbedForm(action.payload);
    const initForm = getInitForm(action.payload);
    yield race({
      changes: call(changes),
      embedForm: call(embedForm),
      initForm: call(initForm),
      closeForm: take(SELECTOR_CLEAR),
    });
  }
}