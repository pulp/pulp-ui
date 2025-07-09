import { t } from '@lingui/core/macro';
import { Button } from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { useEffect, useState } from 'react';
import { MaybeLink, Spinner, Tooltip } from '../components';
import { Paths, formatPath } from '../paths';
import { errorMessage, plugin2api } from '../utilities';

export const LazyRepositories = ({
  content_href,
  emptyText,
  plugin,
  remote_href,
}: {
  content_href?: string;
  emptyText?: string;
  plugin: 'ansible' | 'file' | 'rpm' | 'debian';
  remote_href?: string;
}) => {
  const [repositories, setRepositories] = useState([]);
  const [count, setCount] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const query = (prepend?) => {
    plugin2api(plugin)
      .RepositoryAPI.list({
        ...(content_href ? { with_content: content_href } : null),
        ...(remote_href ? { remote: remote_href } : null),
        page,
        page_size: 10,
      })
      .then(({ data: { count, results } }) => {
        setRepositories(prepend ? [...prepend, ...results] : results);
        setCount(count);
        setError(null);
        setLoading(false);
      })
      .catch((e) => {
        const { status, statusText } = e.response;
        setRepositories(prepend || []);
        setCount(null);
        setError(errorMessage(status, statusText));
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!remote_href && !content_href) {
      setRepositories([]);
      setCount(null);
      setPage(1);
      setError(null);
      setLoading(false);
      return;
    }

    setRepositories([]);
    setCount(null);
    setPage(1);
    setError(null);
    setLoading(true);

    query();
  }, [content_href, remote_href]);

  // support pagination, but page == 1 is handled above
  useEffect(() => {
    if (page === 1) {
      return;
    }

    query(repositories);
  }, [page]);

  const errorElement = error && (
    <Tooltip content={t`Failed to load repositories: ${error}`} key='empty'>
      <Button variant='plain'>
        <ExclamationCircleIcon />
      </Button>
    </Tooltip>
  );

  const loadMore = () => {
    setPage((page) => page + 1);
  };

  const pluginPaths = Paths[plugin] as Record<string, Record<string, string>>;

  return loading ? (
    <Spinner size='sm' />
  ) : error ? (
    errorElement
  ) : (
    <>
      {repositories?.map?.(({ name }, index) => (
        <>
          {index ? ', ' : ''}
          <MaybeLink
            to={
              pluginPaths?.repository?.detail
                ? formatPath(pluginPaths.repository.detail, { name })
                : null
            }
          >
            {name}
          </MaybeLink>
        </>
      ))}
      {!repositories?.length ? (emptyText ?? '---') : null}
      {count > repositories?.length ? (
        <>
          {' '}
          <a onClick={loadMore}>{t`(more)`}</a>
        </>
      ) : null}
    </>
  );
};
