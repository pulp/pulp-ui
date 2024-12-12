import PulpLogo from 'static/images/pulp_logo.png';

interface IProps {
  alt: string;
}

export const SmallLogo = ({ alt }: IProps) => (
  <img style={{ height: '35px' }} src={PulpLogo} alt={alt} />
);
