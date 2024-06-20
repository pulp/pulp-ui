import { t } from '@lingui/macro';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Paths, formatPath } from 'src/paths';

interface IProps {
  button?: boolean;
}

export const LoginLink = ({ button }: IProps) => {
  const { pathname } = useLocation();

  // NOTE: also update AuthHandler#render (src/routes.tsx) when changing this
  //if (featureFlags?.external_authentication && UI_EXTERNAL_LOGIN_URI) {
  //  return <a className={className} href={loginURL(pathname)}>{t`Login`}</a>;
  //}

  return (
    <Link
      className={button ? 'pf-v5-c-button pf-m-primary' : ''}
      to={formatPath(Paths.login, {}, { next: pathname })}
    >{t`Login`}</Link>
  );
};
