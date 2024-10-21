import { t } from '@lingui/macro';
import { Bullseye } from '@patternfly/react-core';
import React from 'react';
import { BaseHeader, Main } from 'src/components';
import PulpLogo from 'static/images/pulp_logo.png';
import './not-found.scss';

export const NotFound = () => (
  <>
    <BaseHeader title={t`404 - Page not found`} />
    <Main>
      <section className='pulp-section'>
        <Bullseye className='pulp-c-bullseye'>
          <div className='pulp-c-bullseye__center'>
            <img src={PulpLogo} alt={/* decorative */ ''} />
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
