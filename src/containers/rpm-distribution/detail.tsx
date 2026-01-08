import { msg, t } from '@lingui/core/macro';
import { rpmDistributionDeleteAction, rpmDistributionEditAction } from 'src/actions';
import { RPMDistributionAPI, type RPMDistributionType } from 'src/api';
import { PageWithTabs } from 'src/components';
import { Paths, formatPath } from 'src/paths';
import { DetailsTab } from './tab-details';

const RPMDistributionDetail = PageWithTabs<RPMDistributionType>({
  breadcrumbs: ({ name }) =>
    [
      { url: formatPath(Paths.rpm.distribution.list), name: t`Distributions` },
      { url: formatPath(Paths.rpm.distribution.detail, { name }), name },
    ].filter(Boolean),
  displayName: 'RPMDistributionDetail',
  errorTitle: msg`Distribution could not be displayed.`,
  headerActions: [rpmDistributionEditAction, rpmDistributionDeleteAction],
  listUrl: formatPath(Paths.rpm.distribution.list),
  query: ({ name }) =>
    RPMDistributionAPI.list({ name })
      .then(({ data: { results } }) => results[0])
      .then(
        (distribution) =>
          distribution ||
          // using the list api, so an empty array is really a 404
          Promise.reject({ response: { status: 404 } }),
      ),
  renderTab: (tab, item, actionContext) =>
    ({
      details: <DetailsTab item={item} actionContext={actionContext} />,
    })[tab],
  tabs: (tab, name) => [
    {
      active: tab === 'details',
      title: t`Details`,
      link: formatPath(Paths.rpm.distribution.detail, { name }, { tab: 'details' }),
    },
  ],
});

export default RPMDistributionDetail;
