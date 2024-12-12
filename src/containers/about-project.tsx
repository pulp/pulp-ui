import { t } from '@lingui/core/macro';
import {
  Brand,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Gallery,
} from '@patternfly/react-core';
import { BaseHeader, ExternalLink, Main } from 'src/components';
import { type RouteProps, withRouter } from 'src/utilities';
import PulpLogo from 'static/images/pulp_logo.png';

const AboutProject = (_props: RouteProps) => (
  <>
    <BaseHeader title={t`About project`} />
    <Main>
      <Card>
        <CardTitle>
          <Brand
            style={{
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            src={PulpLogo}
            alt={t`Pulp logo`}
          />
        </CardTitle>
        <CardBody style={{ textAlign: 'center' }}>
          {t`Pulp is an open source project that makes it easy for developers to fetch, upload, and distribute Software Packages on-prem or in the cloud.`}
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <Gallery
            hasGutter
            style={{ gridTemplateColumns: '32.5% 32.5% 32.5%' }}
          >
            <Card>
              <CardTitle>{APPLICATION_NAME}</CardTitle>
              <CardBody>{t`This project is an attempt to up-cycle the Ansible Galaxy UI codebase. The first version contains mostly saved code with minor fixes. In the future more types of content will be added. We welcome kindly any contributions.`}</CardBody>
              <CardFooter>
                {' '}
                <ExternalLink href='https://github.com/pulp/pulp-ui'>
                  {t`GitHub repository`}
                </ExternalLink>
              </CardFooter>
            </Card>
            <Card>
              <CardTitle>{t`Issue tracker`}</CardTitle>
              <CardBody>{t`If you find a bug or have an idea for enhancement, please feel free to file a Github issue. Thank you for contributing to improvement of the project.`}</CardBody>
              <CardFooter>
                {' '}
                <ExternalLink href='https://github.com/pulp/pulp-ui/issues'>
                  {t`GitHub issues`}
                </ExternalLink>
              </CardFooter>
            </Card>
            <Card>
              <CardTitle>{t`Get involved`}</CardTitle>
              <CardBody>{t`Join our communication channels and get to know the contributors and users of Pulp's strong ecosystem.`}</CardBody>
              <CardFooter>
                {' '}
                <ExternalLink href='https://pulpproject.org/help/community/get-involved/'>
                  {t`Community`}
                </ExternalLink>
              </CardFooter>
            </Card>
          </Gallery>
        </CardBody>
      </Card>
    </Main>
  </>
);

export default withRouter(AboutProject);
