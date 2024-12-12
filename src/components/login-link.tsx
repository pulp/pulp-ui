import { t } from '@lingui/macro';
import { Link, useLocation } from 'react-router-dom';
import { Paths, formatPath } from 'src/paths';
import { config } from 'src/ui-config';
import { loginURL } from 'src/utilities';

interface IProps {
  button?: boolean;
}

export const LoginLink = ({ button }: IProps) => {
  const { pathname } = useLocation();
  const className = button ? 'pf-v5-c-button pf-m-primary' : '';

  // NOTE: also update AuthHandler#render (src/routes.tsx) when changing this
  if (config.UI_EXTERNAL_LOGIN_URI) {
    return <a className={className} href={loginURL(pathname)}>{t`Login`}</a>;
  }

  return (
    <Link
      className={className}
      to={formatPath(Paths.meta.login, {}, { next: pathname })}
    >{t`Login`}</Link>
  );
};
