import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { Checkbox, Text } from '@patternfly/react-core';
import { type CollectionVersionSearch } from 'src/api';
import { DeleteModal } from 'src/components';

interface IProps {
  cancelAction: () => void;
  collectionVersion?: string;
  collections: CollectionVersionSearch[];
  confirmDelete: boolean;
  deleteAction: () => void;
  deleteCollection: CollectionVersionSearch;
  deleteFromRepo?: string;
  isDeletionPending: boolean;
  setConfirmDelete: (val) => void;
}

export const DeleteCollectionModal = ({
  cancelAction,
  collectionVersion,
  collections,
  confirmDelete,
  deleteAction,
  deleteCollection,
  deleteFromRepo,
  isDeletionPending,
  setConfirmDelete,
}: IProps) =>
  deleteCollection ? (
    <DeleteModal
      spinner={isDeletionPending}
      cancelAction={() => cancelAction()}
      deleteAction={() => deleteAction()}
      isDisabled={!confirmDelete || isDeletionPending}
      title={
        collectionVersion
          ? t`Delete collection version?`
          : t`Delete collection?`
      }
    >
      <Text style={{ paddingBottom: 'var(--pf-v5-global--spacer--md)' }}>
        {collectionVersion && collections.length !== 1 ? (
          deleteFromRepo ? (
            <Trans>
              Removing collection version{' '}
              <b>
                {deleteCollection.collection_version.name} v{collectionVersion}
              </b>{' '}
              from repository <b>{deleteFromRepo}</b>.
            </Trans>
          ) : (
            <Trans>
              Deleting collection version{' '}
              <b>
                {deleteCollection.collection_version.name} v{collectionVersion}
              </b>
              .
            </Trans>
          )
        ) : deleteFromRepo ? (
          <Trans>
            Removing collection{' '}
            <b>{deleteCollection.collection_version.name}</b> from repository{' '}
            <b>{deleteFromRepo}</b>.
          </Trans>
        ) : (
          <Trans>
            Deleting collection{' '}
            <b>{deleteCollection.collection_version.name}</b>.
          </Trans>
        )}
      </Text>
      <Checkbox
        isChecked={confirmDelete}
        onChange={setConfirmDelete}
        label={t`I understand that this action cannot be undone.`}
        id='delete_confirm'
      />
    </DeleteModal>
  ) : null;
