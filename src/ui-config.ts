export const configPromise = fetch('/pulp-ui-config.json').then((data) =>
  data.json(),
);
export let config = null;
configPromise.then((data) => (config = data));
