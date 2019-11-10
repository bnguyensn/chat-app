import React from 'react';
import { useAppState } from '../../store';

function recursiveDisplay(obj) {
  const listItems = Object.keys(obj).map(key => {
    const value = obj[key];

    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      typeof value !== 'function'
    ) {
      return recursiveDisplay(value);
    }

    return <li key={key}>{`${key}: ${value}`}</li>;
  });

  return <ul key={JSON.stringify(obj)}>{listItems}</ul>;
}

export default function StateDisplay() {
  const appState = useAppState();

  return (
    <div className="flex w-full">
      <h2>App state:</h2>
      {recursiveDisplay(appState)}
    </div>
  );
}
