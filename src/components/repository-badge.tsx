import { t } from '@lingui/macro';
import {
  Flex,
  FlexItem,
  Label,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { Link } from 'react-router';
import { useAppContext } from 'src/app-context';
import { Paths, formatPath } from 'src/paths';

interface IProps {
  isBreadcrumbContainer?: boolean;
  isFlexItem?: boolean;
  isTextContent?: boolean;
  name: string;
}

export const RepositoryBadge = ({
  isBreadcrumbContainer,
  isFlexItem,
  isTextContent,
  name,
}: IProps) => {
  const { featureFlags } = useAppContext();

  if (!featureFlags.display_repositories) {
    return null;
  }

  const repoName =
    {
      certified: t`Certified`,
      community: t`Community`,
      published: t`Published`,
      rejected: t`Rejected`,
      staging: t`Staging`,
      validated: t`Validated`,
    }[name] || name;

  const label = (
    <Label variant='outline' isCompact={isTextContent} title={name}>
      <Link to={formatPath(Paths.ansible.repository.detail, { name })}>
        {repoName}
      </Link>
    </Label>
  );

  // collection-card
  if (isTextContent) {
    return (
      <TextContent>
        <Text component={TextVariants.small}>{label}</Text>
      </TextContent>
    );
  }

  // collection-list-item
  if (isFlexItem) {
    return <FlexItem>{label}</FlexItem>;
  }

  // collection-header
  if (isBreadcrumbContainer) {
    return (
      <div style={{ paddingTop: '8px' }}>
        <Flex>
          <FlexItem>
            {t`Repository`}
            &nbsp; &nbsp;
            {label}
          </FlexItem>
        </Flex>
      </div>
    );
  }

  // approval-row
  return label;
};
