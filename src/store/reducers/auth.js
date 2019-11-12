import actions from '../actions/auth';

export const defaultState = {
  provider: null,
  tokens: null,
  user: null,
};

function updateAccessToken(state, action) {
  return {
    ...state,
    tokens: action.payload,
  };
}

function updateUser(state, action) {
  return {
    ...state,
    user: action.payload,
  };
}

export default function authReducers(state, action) {
  switch (action.type) {
    case actions.UPDATE_TOKENS:
      return updateAccessToken(state, action);
    case actions.UPDATE_USER:
      return updateUser(state, action);
    default:
      return state;
  }
}
