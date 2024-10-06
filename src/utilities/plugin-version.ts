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

export function plugin_versions(): Promise<PluginVersion[]> {
  return PulpStatusAPI.cache().then(({ data }) =>
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
