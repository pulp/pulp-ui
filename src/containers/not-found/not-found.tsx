import { t } from '@lingui/macro';
import { Bullseye } from '@patternfly/react-core';
import React from 'react';
import { BaseHeader, Main } from 'src/components';
import { withRouter } from 'src/utilities';
import NotFoundImage from 'static/images/not_found.svg';
import './not-found.scss';

export const NotFound = (_props) => (
  <>
    <BaseHeader title={t`404 - Page not found`} />
    <Main>
      <section className='pulp-section'>
        <Bullseye className='pulp-c-bullseye'>
          <div className='pulp-c-bullseye__center'>
            <img src={NotFoundImage} alt={t`Not found image`} />
            <div>{t`We couldn't find the page you're looking for!`}</div>
            <div className='pf-v5-c-content'>
              <span className='pulp-c-bullseye__404'>404</span>
            </div>
          </div>
        </Bullseye>
      </section>
    </Main>
  </>
);

export default withRouter(NotFound);
