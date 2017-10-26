import { take, race, call, TakeEffect, RaceEffect } from 'redux-saga/effects';
import { SELECTOR_INIT, SELECTOR_CLEAR } from './../consts';

import getChanges from './getChanges';
import getEmbed from './embed';
import getInitForm from './initForm';

export default function* () {
  while (true) {
    const action = yield take(SELECTOR_INIT);
    const changes = getChanges(action.payload);
    const embed = getEmbed(action.payload)
    const initForm = getInitForm(action.payload)
    yield race({
      changes: call(changes),
      embed: call(embed),
      initForm: call(initForm),
      closeForm: take(SELECTOR_CLEAR),
    });
  }
}