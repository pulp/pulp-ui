import type { LoginResponse } from '@pulp-ui/sdk/core/models/login/login-response.zod';
import { describe, expect, it } from 'vitest';
import { credentialsCodec, loginResponseCodec } from './model';

describe('Unit: login model', { tags: ['unit'] }, () => {
  const validResponse = {
    pulp_href: 'https://example.com/pulp/api/v3/users/4/',
    prn: 'prn:auth.user:4',
    username: 'admin',
  } satisfies LoginResponse;

  describe('credentialsCodec', () => {
    it('encodes ASCII credentials as a Basic Auth header', () => {
      expect(
        credentialsCodec.encode({ username: 'admin', password: 'password' }),
      ).toStrictEqual(
        `Basic ${Buffer.from('admin:password', 'utf-8').toString('base64')}`,
      );
    });

    it('encodes Latin-1 credentials as UTF-8', () => {
      expect(
        credentialsCodec.encode({ username: 'José', password: 'pässwörd' }),
      ).toStrictEqual(
        `Basic ${Buffer.from('José:pässwörd', 'utf8').toString('base64')}`,
      );
    });

    it('encodes non Latin-1 credentials as UTF-8', () => {
      expect(
        credentialsCodec.encode({
          username: '한국사용자',
          password: '비밀번호',
        }),
      ).toStrictEqual(
        `Basic ${Buffer.from('한국사용자:비밀번호', 'utf-8').toString('base64')}`,
      );
    });

    it('throws on decode, since a header cannot be reversed', () => {
      expect(() =>
        credentialsCodec.decode(
          `Basic ${Buffer.from('admin:password', 'utf-8').toString('base64')}`,
        ),
      ).toThrow();
    });
  });

  describe('loginResponseCodec', () => {
    it('decodes a complete response, renaming pulp_href to href', () => {
      expect(loginResponseCodec.decode(validResponse)).toStrictEqual({
        href: validResponse.pulp_href,
        prn: validResponse.prn,
        username: validResponse.username,
      });
    });

    it('rejects a response missing a required field', () => {
      expect(() =>
        loginResponseCodec.decode({ ...validResponse, prn: undefined }),
      ).toThrow();
    });

    it('rejects a pulp_href that is not a URL', () => {
      expect(() =>
        loginResponseCodec.decode({ ...validResponse, pulp_href: 'not-a-url' }),
      ).toThrow();
    });

    it('throws on encode, since login responses are server-issued', () => {
      expect(() =>
        loginResponseCodec.encode({
          href: validResponse.pulp_href,
          prn: validResponse.prn,
          username: validResponse.username,
        }),
      ).toThrow();
    });
  });
});
