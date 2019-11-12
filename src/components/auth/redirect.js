import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import { useAppDispatch, useAppState } from '../../store';
import { requestAccessToken } from '../../auth';
import { deleteFromStorage, retrieveFromStorage } from '../../auth/storage';
import endpoints from '../../auth/endpoints.json';
import actions from '../../store/actions/auth';

export default function RedirectComponent() {
  const appState = useAppState();
  const appDispatch = useAppDispatch();

  const accessToken = appState.auth.tokens && appState.auth.tokens.access_token;
  const userDetails = appState.auth.user;

  const provider = retrieveFromStorage('authProvider');

  // This effect runs only after the first render. It requests the access token
  // from the authentication provider indirectly via our API server and updates
  // the application state with the access token and other related stuff.
  useEffect(() => {
    const queryParams = new URL(location.href).searchParams;
    if (!queryParams.has('code') || !queryParams.has('state')) {
      throw new Error('Unexpected redirect URL');
    }

    requestAccessToken(
      {
        provider: retrieveFromStorage('authProvider'),
        code: queryParams.get('code'),
        state: queryParams.get('state'),
      },
      appDispatch
    );
  }, []);

  // This effect runs when the access token exists. It requests user details
  // using the access token and redirects the user away from the redirect page
  // once necessary user details are received.
  useEffect(() => {
    const fetchUserDetails = async () => {
      const providerDefaultHeaders =
        endpoints[provider].defaultAPIHeaders || {};

      const userDetailsRes = await fetch(
        endpoints[provider].userDetailsEndpoint,
        {
          headers: {
            ...providerDefaultHeaders,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!userDetailsRes.ok) {
        throw new Error('Error fetching user details');
      }

      const userDetails = await userDetailsRes.json();

      appDispatch({
        type: actions.UPDATE_USER,
        payload: userDetails,
      });
    };

    if (accessToken && provider) {
      fetchUserDetails();
    }
  }, [accessToken, provider]);

  // This effect runs once user details are obtained. It redirects the user away
  // from the redirect page.
  useEffect(() => {
    if (userDetails) {
      const navigateAndCleanStorage = async () => {
        await navigate(retrieveFromStorage('authPreAuthPage'));

        deleteFromStorage('authPreAuthPage');
      };

      // navigateAndCleanStorage();
    }
  }, [userDetails]);

  return <div />;
}
