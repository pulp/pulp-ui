type RPMChecksumType =
  | 'unknown'
  | 'md5'
  | 'sha'
  | 'sha1'
  | 'sha224'
  | 'sha256'
  | 'sha384'
  | 'sha512';
type RPMAllowedUpsertChecksumsType = 'sha256' | 'sha384' | 'sha512';

type RPMCompressionType = 'zstd' | 'gz' | 'none';

type RPMLayoutType = 'nested_alphabetically' | 'flat' | 'nested_by_digest';

export type {
  RPMChecksumType,
  RPMAllowedUpsertChecksumsType,
  RPMCompressionType,
  RPMLayoutType,
};
