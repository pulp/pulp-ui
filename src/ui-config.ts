import defaults from '../pulp-ui-config.json';

export const configPromise = fetch('/pulp-ui-config.json').then((data) =>
  data.status > 0 && data.status < 300
    ? data.json()
    : Promise.reject(`${data.status}: ${data.statusText}`),
);

export let config = null;

export const configFallback = () => (config = defaults);

configPromise.then((data) => (config = data));
