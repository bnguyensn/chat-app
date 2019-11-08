import React, { useContext, useReducer } from 'react';

const defaultAppState = {
  accessToken: undefined,
  user: undefined,
};
export const AppStateContext = React.createContext();
export const AppDispatchContext = React.createContext();

export const actions = {
  UPDATE_ACCESS_TOKEN: '@AUTH/UPDATE_ACCESS_TOKEN',
  UPDATE_USER: '@AUTH/UPDATE_USER',
};

function appReducer(state, action) {
  switch (action.type) {
    case actions.UPDATE_ACCESS_TOKEN: {
      return {
        ...state,
        accessToken: action.payload,
      };
    }
    case actions.UPDATE_USER: {
      return {
        ...state,
        user: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (context === 'undefined') {
    throw new Error('useAppState must be used within an AppProvider');
  }

  return context;
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext);

  if (context === 'undefined') {
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
