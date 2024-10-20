import { satisfies } from 'compare-versions';
import { PulpStatusAPI } from 'src/api';

interface PluginVersion {
  name: string;
  version: string;
}

interface PluginRequirement {
  name: string;
  feature?: string;
  specifier?: string;
}

const cache = {
  promise: null,
  time: 0,
};

const cached = (fn) => {
  // expires after 5 minutes
  if (!cache.promise || cache.time + 300000 < Date.now()) {
    cache.time = Date.now();
    cache.promise = fn();
  }

  return cache.promise;
};

export function plugin_versions(): Promise<PluginVersion[]> {
  return cached(() => PulpStatusAPI.get()).then(({ data }) =>
    data.versions.map(({ component, version }) => ({
      name: component,
      version: version,
    })),
  );
}

export function has_plugins(
  plugin_requirements: PluginRequirement[],
): Promise<boolean> {
  return plugin_versions().then((versions) => {
    const map_versions = new Map(
      versions.map(({ name, version }) => [name, version]),
    );
    const present = (req) =>
      map_versions.has(req.name) &&
      (req.specifier
        ? satisfies(map_versions.get(req.name), req.specifier)
        : true);
    return plugin_requirements.every(present);
  });
}
