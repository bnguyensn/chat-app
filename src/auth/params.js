import endpoints from './endpoints.json';

/**
 * Create a query string from a query object.
 *
 * @param {object} queryObj - An object with key-value pairs representing a
 * query string's key-value pairs
 *
 * @returns {string} - The query string created from the provided query object
 */
export function createQueryString(queryObj) {
  return Object.keys(queryObj).reduce((finalQueryString, queryKey, index) => {
    if (typeof queryObj[queryKey] !== 'boolean' && !queryObj[queryKey]) {
      return finalQueryString;
    }

    const queryValue = encodeURIComponent(queryObj[queryKey]);
    const ampersand = index === 0 ? '' : '&';

    return `${finalQueryString}${ampersand}${queryKey}=${queryValue}`;
  }, '');
}
