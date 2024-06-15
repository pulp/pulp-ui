import { t } from '@lingui/macro';
import { Card, CardBody, CardTitle } from '@patternfly/react-core';
import React, { Component } from 'react';
import { PulpStatusAPI } from 'src/api';
import {
  AlertList,
  type AlertType,
  BaseHeader,
  LoadingSpinner,
  Main,
  closeAlert,
} from 'src/components';
import { type RouteProps, jsxErrorMessage, withRouter } from 'src/utilities';

interface IState {
  alerts: AlertType[];
}

class PulpStatus extends Component<RouteProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      alerts: [],
    };
  }

  componentDidMount() {
    this.query();
  }

  render() {
    const { alerts } = this.state;

    return (
      <>
        <AlertList
          alerts={alerts}
          closeAlert={(i) =>
            closeAlert(i, {
              alerts,
              setAlerts: (alerts) => this.setState({ alerts }),
            })
          }
        />
        <BaseHeader title={t`Status`} />
        <Main>
          <Card>
            <section className='body pf-v5-c-content'>
              <CardTitle>
                <h2>{t`TODO`}</h2>
              </CardTitle>
              <CardBody>
                <LoadingSpinner />
              </CardBody>
            </section>
          </Card>
        </Main>
      </>
    );
  }

  private query() {
    PulpStatusAPI.get()
      .then(({ data }) => {
        // TODO
        console.log(data);
      })
      .catch((e) => {
        const { status, statusText } = e.response;
        this.setState({
          alerts: [
            ...this.state.alerts,
            {
              variant: 'danger',
              title: t`Failed to load status`,
              description: jsxErrorMessage(status, statusText),
            },
          ],
        });
      });
  }
}

export default withRouter(PulpStatus);
