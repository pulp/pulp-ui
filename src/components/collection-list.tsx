import { t } from '@lingui/core/macro';
import { DataList } from '@patternfly/react-core';
import { type ReactNode } from 'react';
import { type CollectionVersionSearch } from 'src/api';
import {
  CollectionListItem,
  EmptyStateFilter,
  PulpPagination,
} from 'src/components';
import { ParamHelper } from 'src/utilities';

interface IProps {
  collectionControls: (collection) => {
    dropdownMenu?: ReactNode | null;
    uploadButton?: ReactNode | null;
  };
  collections: CollectionVersionSearch[];
  displaySignatures: boolean;
  ignoredParams: string[];
  itemCount: number;
  params: {
    page?: number;
    page_size?: number;
    sort?: string;
  };
  updateParams: (params) => void;
}

// only used in namespace detail, collections uses individual items
export const CollectionList = ({
  collectionControls,
  collections,
  displaySignatures,
  ignoredParams,
  itemCount,
  params,
  updateParams,
}: IProps) => {
  return (
    <>
      <DataList aria-label={t`List of collections`}>
        {collections.length ? (
          collections.map((c, i) => (
            <CollectionListItem
              key={i}
              collection={c}
              displaySignatures={displaySignatures}
              showNamespace
              {...collectionControls(c)}
            />
          ))
        ) : (
          <EmptyStateFilter
            clearAllFilters={() => {
              ParamHelper.clearAllFilters({
                params,
                ignoredParams,
                updateParams,
              });
            }}
          />
        )}
      </DataList>
      <PulpPagination
        count={itemCount}
        params={params}
        updateParams={updateParams}
      />
    </>
  );
};
