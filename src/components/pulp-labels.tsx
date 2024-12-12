import { t } from '@lingui/macro';
import { Button, Label } from '@patternfly/react-core';
import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';
import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { useState } from 'react';
import { LabelGroup } from 'src/components';

interface Label {
  key: string;
  value: string;
  id: number;
  valid: boolean;
}

export const PulpLabels = ({
  labels,
  updateLabels,
}: {
  labels: Record<string, string>;
  updateLabels?: (l) => void;
}) => {
  const [labelS, setLabels] = useState(
    !labels || !Object.keys(labels).length
      ? []
      : Object.entries(labels).map(([k, v], i) => ({
          key: k,
          value: v,
          id: i,
          valid: true,
        })),
  );
  const [idIndex, setIdIndex] = useState(labelS.length);
  const update = (newLabels: Label[]) => {
    const newLabelsObj = newLabels.reduce(
      (o, label) => ({ ...o, [label.key]: label.value }),
      {},
    );
    updateLabels(newLabelsObj);
  };

  const onClose = (labelId: number) => {
    const newLabels = labelS
      .filter((l) => l.id !== labelId)
      .map((v, i) => ({ ...v, id: i }));
    update(newLabels);
    setLabels(newLabels);
    setIdIndex(newLabels.length);
  };

  const onEdit = (newText: string, index: number) => {
    const copy = [...labelS];
    const [k, v] = newText.split(':', 2);
    const [ks, vs] = [k.trim(), v ? v.trim() : ''];
    const valid = !!ks.match(/^[\w ]+$/) && vs.search(/[,()]/) == -1;
    copy[index] = { key: ks, value: vs, id: labelS[index].id, valid: valid };
    update(copy);
    setLabels(copy);
  };

  const onAdd = () => {
    const newLabels = [
      ...labelS,
      { key: 'key', value: 'value', id: idIndex, valid: true },
    ];
    update(newLabels);
    setLabels(newLabels);
    setIdIndex(idIndex + 1);
  };

  return updateLabels ? (
    <LabelGroup
      isEditable
      addLabelControl={
        <Button variant='plain' aria-label='Create new label' onClick={onAdd}>
          <PlusCircleIcon />
        </Button>
      }
      style={{ alignItems: 'center' }}
    >
      {labelS.length ? (
        labelS.map(({ key, value, id, valid }) => (
          <Label
            key={id}
            onClose={() => onClose(id)}
            onEditCancel={(_e, prevText) => onEdit(prevText, id)}
            onEditComplete={(_e, newText) => onEdit(newText, id)}
            isEditable
            icon={!valid ? <InfoCircleIcon /> : null}
            color={!valid ? 'red' : null}
          >
            {key + (value ? ': ' + value : '')}
          </Label>
        ))
      ) : (
        <>{t`None`}</>
      )}
    </LabelGroup>
  ) : (
    <LabelGroup>
      {labelS.length ? (
        labelS.map(({ key, value, id }) => (
          <Label key={id}>
            {key}
            {value ? ': ' + value : null}
          </Label>
        ))
      ) : (
        <>{t`None`}</>
      )}
    </LabelGroup>
  );
};
