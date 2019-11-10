import { extractQueryParam, requestAccessToken } from './index';
import { retrieveFromStorage } from './storage';
import { actions } from '../store';

export default async function checkRedirect(provider, appDispatch) {
  const code = extractQueryParam(location.href, 'code');
  const state = extractQueryParam(location.href, 'state');

  if (code && state) {
    const storedState = retrieveFromStorage(state);

    if (storedState !== state) {
      throw new Error(
        'State mismatch between the re-directed value and what was stored in LocalStorage.'
      );
    }

    const accessToken = await requestAccessToken(provider, code, state);

    appDispatch(actions.UPDATE_TOKENS, accessToken);
  }
}
