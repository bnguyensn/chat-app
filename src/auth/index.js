import urls from './urls.json';
import getOAuthQueryParamsString from './params';

async function requestIdentity(provider) {
  if (!urls[provider]) {
    throw new Error(`OAuth provider '${provider}' is not supported.`);
  }

  const authEndpoint = urls[provider].authEndpoint;

  const authQueryParamsString = await getOAuthQueryParamsString({
    login: undefined,
  });

  const authUrl = `${authEndpoint}?${authQueryParamsString}`;

  await fetch(authUrl);
}
