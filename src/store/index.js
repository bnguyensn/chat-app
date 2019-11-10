import React, { useContext, useReducer } from 'react';
import authActions from './actions/auth';
import authReducers, {
  defaultState as defaultAuthState,
} from './reducers/auth';

const AppStateContext = React.createContext();
const AppDispatchContext = React.createContext();

const defaultAppState = {
  auth: defaultAuthState,
};

export const actions = {
  auth: authActions,
};

function appReducer(state, action) {
  return {
    auth: authReducers(state.auth, action),
  };
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }

  return context;
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext);

  if (context === undefined) {
    throw new Error('useAppDispatch must be used within an AppProvider');
  }

  return context;
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, defaultAppState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}
