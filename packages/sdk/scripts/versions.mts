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

async function fetchRemoteVersions(): Promise<Map<string, string>> {
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

  return new Map(
    remoteVersionsData.map(({ component, version }) => [component, version]),
  );
}

function readLocalVersions(): Record<string, string> {
  const localVersionsData = readFileSync(
    new URL('../pulp-versions.json', import.meta.url),
    'utf-8',
  );
  return JSON.parse(localVersionsData).versions;
}

function isVersionLess(remoteVersion: string, localVersion: string): boolean {
  const remoteVersionParts = remoteVersion.split('.').map(Number);
  const localVersionParts = localVersion.split('.').map(Number);
  const maxValuesLength = Math.max(
    remoteVersionParts.length,
    localVersionParts.length,
  );

  for (let i = 0; i < maxValuesLength; i++) {
    const firstPart = remoteVersionParts[i] ?? 0;
    const secondPart = localVersionParts[i] ?? 0;

    if (firstPart !== secondPart) {
      return firstPart < secondPart;
    }
  }

  return false;
}

export {
  fetchRemoteVersions,
  readLocalVersions,
  isVersionLess,
  supportedPlugins,
};
