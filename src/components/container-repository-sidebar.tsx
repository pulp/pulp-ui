import { t } from '@lingui/core/macro';
import {
  Nav,
  NavExpandable,
  NavItem,
  Title,
} from '@patternfly/react-core';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  ContainerDistributionAPI,
} from 'src/api';
import { EmptyStateNoData } from 'src/components';
import { Paths, formatEEPath } from 'src/paths';
import { NavList, SearchInput, Spinner } from './patternfly-wrappers/l10n';

interface NativeContainerDistributionType {
  name: string;
  base_path: string;
  remote: string | null;
  description: string | null;
  pulp_created: string;
}

type RepositoryTypeGroup = 'local' | 'remote';

interface IProps {
  selectedRepository?: string;
}

const PAGE_SIZE = 200;

const repositoryType = (
  repository: NativeContainerDistributionType,
): RepositoryTypeGroup =>
  repository.remote ? 'remote' : 'local';

async function loadAllRepositories() {
  const result = await ContainerDistributionAPI.list({
    page_size: PAGE_SIZE,
    sort: 'name',
  });
  return result.data.results as NativeContainerDistributionType[];
}

export const ContainerRepositorySidebar = ({ selectedRepository }: IProps) => {
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [repositories, setRepositories] = useState<NativeContainerDistributionType[]>([]);
  const [error, setError] = useState<string>(null);
  const typeLabels: Record<RepositoryTypeGroup, string> = {
    local: t`Local`,
    remote: t`Remote`,
  };

  useEffect(() => {
    let cancelled = false;

    loadAllRepositories()
      .then((items) => {
        if (!cancelled) {
          setRepositories(items);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e?.message || t`Failed to load repositories.`);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const groupedRepositories = useMemo(() => {
    const normalizedFilter = filter.toLowerCase();
    const filtered = repositories.filter(({ name, base_path }) => {
      const haystack = [name, base_path]
        .filter(Boolean)
        .join('/')
        .toLowerCase();

      return haystack.includes(normalizedFilter);
    });

    return {
      local: filtered.filter((repository) => repositoryType(repository) === 'local'),
      remote: filtered.filter((repository) => repositoryType(repository) === 'remote'),
    };
  }, [filter, repositories]);

  const hasResults = Object.values(groupedRepositories).some(
    ({ length }) => length > 0,
  );

  return (
    <aside className='container-repository-sidebar'>
      <div className='container-repository-sidebar__header'>
        <Title headingLevel='h2' size='lg'>
          {t`Repository types`}
        </Title>
        <SearchInput
          value={filter}
          onChange={(_event, value) => setFilter(value)}
          onClear={() => setFilter('')}
          aria-label={t`Filter repositories`}
          placeholder={t`Filter repositories`}
        />
      </div>

      {loading ? (
        <div className='container-repository-sidebar__status'>
          <Spinner size='md' />
        </div>
      ) : error ? (
        <EmptyStateNoData
          title={t`Repositories unavailable`}
          description={error}
        />
      ) : !hasResults ? (
        <EmptyStateNoData
          title={t`No matching repositories`}
          description={
            filter
              ? t`No repositories match the current filter.`
              : t`No repositories are available.`
          }
        />
      ) : (
        <Nav theme='light' aria-label={t`Container repositories by type`}>
          <NavList>
            {(['local', 'remote'] as RepositoryTypeGroup[])
              .filter((type) => groupedRepositories[type].length > 0)
              .map((type) => (
                <NavExpandable
                  key={type}
                  title={`${typeLabels[type]} (${groupedRepositories[type].length})`}
                  isExpanded
                >
                  {groupedRepositories[type].map((repository) => {
                    const link = formatEEPath(Paths.container.repository.detail, {
                      container: repository.base_path,
                    });

                    return (
                      <NavItem
                        key={repository.name}
                        isActive={selectedRepository === repository.name}
                      >
                        <Link to={link}>
                          <span className='container-repository-sidebar__link'>
                            {repository.name}
                          </span>
                        </Link>
                      </NavItem>
                    );
                  })}
                </NavExpandable>
              ))}
          </NavList>
        </Nav>
      )}
    </aside>
  );
};
