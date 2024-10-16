import { t } from '@lingui/macro';
import { Gallery, Card, CardFooter, CardBody, CardTitle, Brand } from '@patternfly/react-core';
import React, { Component } from 'react';
import {BaseHeader, ExternalLink, Main} from 'src/components';
import { type RouteProps, withRouter } from 'src/utilities';
import PulpLogo from 'static/images/pulp_logo.png';

class AboutProject extends Component<RouteProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <BaseHeader title={t`About project`} />
        <Main>
            <Card ouiaId="BasicCard">
              <CardTitle>
              <Brand style={{'display': 'block', 'margin-left': 'auto', 'margin-right': 'auto'}} src={PulpLogo} alt="PatternFly logo"/>
              </CardTitle>
              <CardBody style={{'text-align': 'center'}}>Pulp is an open source project that makes it easy for developers to fetch, upload, and distribute Software Packages on-prem or in the cloud.</CardBody>
            </Card>
          <Card ouiaId="BasicCard">
            <CardBody>
              <Gallery hasGutter style={{'grid-template-columns': '32.5% 32.5% 32.5%'}}>
                <Card ouiaId="BasicCard">
                  <CardTitle>Pulp UI</CardTitle>
                  <CardBody>{t`This project is an attempt to up-cycle Ansible Galaxy UI codebase. The first version contains mostly saved code with minor fixes. In the future more types of content will be added. We welcome kindly contributions.`}</CardBody>
                  <CardFooter> <ExternalLink
                    href={'https://github.com/pulp/pulp_ui'}
                  >
                    {'GitHub repository'}
                  </ExternalLink></CardFooter>
                </Card>
              <Card ouiaId="BasicCard">
                <CardTitle>Issue tracker</CardTitle>
                <CardBody>{`If you find a bug or have an idea for enhancement, please feel free to file a Github issue. Thank you for contributing to improvement of the project.`}</CardBody>
                <CardFooter> <ExternalLink
                  href={'https://github.com/pulp/pulp-ui/issues'}
                >
                  {'GitHub issues'}
                </ExternalLink></CardFooter>
              </Card>
              <Card ouiaId="BasicCard">
                <CardTitle>
                  Get involved
                </CardTitle>
                <CardBody>{`Join our communication channels and get to know the contributors and users of Pulp's strong ecosystem.`}</CardBody>
                <CardFooter> <ExternalLink
                  href={'https://pulpproject.org/help/community/get-involved/'}
                >
                  {'Community'}
                </ExternalLink></CardFooter>
              </Card>
              </Gallery>
            </CardBody>
          </Card>
        </Main>
      </>
    );
  }
}

export default withRouter(AboutProject);
