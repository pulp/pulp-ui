import { Title } from '@patternfly/react-core';
import { type ReactNode, useEffect } from 'react';
import './header.scss';

interface IProps {
  breadcrumbs?: ReactNode;
  children?: ReactNode;
  className?: string;
  contextSelector?: ReactNode;
  logo?: ReactNode;
  pageControls?: ReactNode;
  status?: ReactNode;
  subTitle?: ReactNode;
  title: string;
  versionControl?: ReactNode;
}

export const BaseHeader = ({
  title,
  logo,
  pageControls,
  children,
  breadcrumbs,
  className,
  contextSelector,
  versionControl,
  status,
  subTitle,
}: IProps) => {
  useEffect(() => {
    document.title = title
      ? `${APPLICATION_NAME} - ${title}`
      : APPLICATION_NAME;
  }, [title]);

  return (
    <div
      className={className}
      style={{
        backgroundColor: 'var(--pf-v5-global--BackgroundColor--100)',
        padding: '0 24px',
      }}
    >
      {contextSelector || null}
      {breadcrumbs && (
        <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
          {breadcrumbs}
        </div>
      )}
      {!breadcrumbs && !contextSelector && <div style={{ height: '24px' }} />}

      <div
        data-cy='column-section'
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <div
          data-cy='title-box'
          style={{ display: 'flex', alignItems: 'center' }}
        >
          {logo}
          <div>
            <Title headingLevel='h1' size='2xl'>
              {title}
              {status}
            </Title>
            {subTitle}
          </div>
        </div>
        {pageControls || null}
      </div>
      {versionControl || null}

      {children ? (
        <div className='pulp-header-bottom'>{children}</div>
      ) : (
        <div style={{ height: '24px' }} />
      )}
    </div>
  );
};
