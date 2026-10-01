import { readFileSync } from 'node:fs';

const supportedPlugins = [
  'core',
  'hugging_face',
  'python',
  'gem',
  'ansible',
  'certguard',
  'container',
  'deb',
  'rpm',
  'maven',
  'npm',
  'ostree',
];

interface RemoteVersion {
  component: string;
  version: string;
}

const remoteVersionsResponse = await fetch(
  'http://localhost:8080/pulp/api/v3/status/',
  {
    method: 'GET',
  },
);

if (!remoteVersionsResponse.ok) {
  throw new Error('Unable to get remote versions from Pulp.');
}

const remoteVersionsData: RemoteVersion[] = (
  await remoteVersionsResponse.json()
).versions;

if (!Array.isArray(remoteVersionsData)) {
  throw new Error('Malformed remote versions response.');
}

const remoteVersions = new Map(
  remoteVersionsData.map(({ component, version }) => [component, version]),
);

const localVersionsData = readFileSync(
  new URL('../pulp-versions.json', import.meta.url),
  'utf-8',
);
const localVersions: Record<string, string> =
  JSON.parse(localVersionsData).versions;

const notInstalled: string[] = [];
const notTracked: string[] = [];
const regressions: string[] = [];

for (const plugin of supportedPlugins) {
  const remoteVersion = remoteVersions.get(plugin);
  const localVersion = localVersions[plugin];

  if (remoteVersion === undefined) {
    notInstalled.push(plugin);
    continue;
  }

  if (localVersion === undefined) {
    notTracked.push(plugin);
    continue;
  }

  if (remoteVersion < localVersion) {
    regressions.push(plugin);
  }
}

console.log(regressions);
