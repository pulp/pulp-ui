import { t } from '@lingui/macro';
import {
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import { type ReactNode, useState } from 'react';
import { AppliedFilters, CompoundFilter } from 'src/components';

const PageSection = ({ children, style }: { children: ReactNode; style }) => (
  <section className='pulp-section' style={style}>
    {children}
  </section>
);

export const MultiSearchSearch = ({
  params,
  style,
  updateParams,
}: {
  params?;
  style?;
  updateParams: (p) => void;
}) => {
  const [inputText, setInputText] = useState<string>('');

  return (
    <PageSection style={style}>
      <div className='pulp-toolbar'>
        <Toolbar>
          <ToolbarContent>
            <ToolbarGroup>
              <ToolbarItem>
                <CompoundFilter
                  inputText={inputText}
                  onChange={setInputText}
                  updateParams={(p) => updateParams(p)}
                  params={params || {}}
                  filterConfig={[
                    {
                      id: 'keywords',
                      title: t`Keywords`,
                    },
                  ]}
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </div>
      <div>
        <AppliedFilters
          updateParams={(p) => {
            updateParams(p);
            setInputText('');
          }}
          params={params || {}}
          ignoredParams={['page_size', 'page', 'sort', 'ordering']}
          niceNames={{
            keywords: t`Keywords`,
          }}
        />
      </div>
    </PageSection>
  );
};
