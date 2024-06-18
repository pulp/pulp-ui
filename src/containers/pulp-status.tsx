import { t } from '@lingui/macro';
import { Card, CardBody, CardTitle, Progress } from '@patternfly/react-core';
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
import {
  type RouteProps,
  getHumanSize,
  jsxErrorMessage,
  withRouter,
} from 'src/utilities';

interface IState {
  alerts: AlertType[];
  status?;
}

class PulpStatus extends Component<RouteProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      alerts: [],
      status: null,
    };
  }

  componentDidMount() {
    this.query();
  }

  render() {
    const { alerts, status } = this.state;

    const value = status
      ? (100 / status.storage.total) * status.storage.used
      : 0;
    const free = status ? getHumanSize(status.storage.free) : 0;

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
                {!status ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <Progress
                      value={value}
                      title={t`Storage`}
                      variant={
                        value > 88
                          ? 'danger'
                          : value > 66
                            ? 'warning'
                            : value > 33
                              ? null
                              : 'success'
                      }
                    />
                    <br />
                    {t`Free`} {free}
                    <br />
                    TODO versions, workers.. .. and enable/disable menu based on
                    .versions
                    <pre>{JSON.stringify(status, null, 2)}</pre>
                  </>
                )}
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
        this.setState({ status: data });
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
