import { t } from '@lingui/macro';
import { Gallery } from '@patternfly/react-core';
import React, { Component } from 'react';
import { BaseHeader, Main } from 'src/components';
import { type RouteProps, withRouter } from 'src/utilities';

class AboutProject extends Component<RouteProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <BaseHeader title={t`About project`} />
        <Main>
          <Gallery hasGutter></Gallery>
          <br />
        </Main>
      </>
    );
  }
}

export default withRouter(AboutProject);
