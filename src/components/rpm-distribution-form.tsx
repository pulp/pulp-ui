import { t } from '@lingui/core/macro';
import {
  ActionGroup,
  Button,
  Checkbox,
  Form,
  FormGroup,
  TextInput,
} from '@patternfly/react-core';
import {
  type RPMDistributionType,
} from 'src/api';
import {
  FormFieldHelper,
  HelpButton,
  PulpLabels,
} from 'src/components';
import {
  type ErrorMessagesType,
} from 'src/utilities';

interface IProps {
  allowEditName: boolean;
  errorMessages: ErrorMessagesType;
  onCancel: () => void;
  onSave: ({ createDistribution }) => void;
  plugin: 'ansible' | 'file' | 'rpm';
  distribution: RPMDistributionType;
  updateDistribution: (d) => void;
  closeModal: () => void;
  saveDistribution: () => void;
}

export const RPMDistributionForm = ({
  allowEditName,
  errorMessages,
  onCancel,
  onSave,
  distribution,
  updateDistribution,
  saveDistribution,
}: IProps) => {
  const requiredFields = [];
  const disabledFields = allowEditName ? [] : ['name'];

  const formGroup = (fieldName, label, helperText, children) => (
    <FormGroup
      key={fieldName}
      fieldId={fieldName}
      label={
        helperText ? (
          <>
            {label} <HelpButton content={helperText} />
          </>
        ) : (
          label
        )
      }
      isRequired={requiredFields.includes(fieldName)}
    >
      {children}
      <FormFieldHelper
        variant={fieldName in errorMessages ? 'error' : 'default'}
      >
        {errorMessages[fieldName]}
      </FormFieldHelper>
    </FormGroup>
  );
  const inputField = (fieldName, label, helperText, props) =>
    formGroup(
      fieldName,
      label,
      helperText,
      <TextInput
        validated={fieldName in errorMessages ? 'error' : 'default'}
        isRequired={requiredFields.includes(fieldName)}
        isDisabled={disabledFields.includes(fieldName)}
        id={fieldName}
        value={distribution[fieldName] || ''}
        onChange={(_event, value) =>
          updateDistribution({ ...distribution, [fieldName]: value })
        }
        {...props}
      />,
    );
  const stringField = (fieldName, label, helperText?) =>
    inputField(fieldName, label, helperText, { type: 'text' });
  const numericField = (fieldName, label, helperText?) =>
    inputField(fieldName, label, helperText, { type: 'number' });

  const isValid = !requiredFields.find((field) => !distribution[field]);

  return (
    <Form>
      {stringField('name', t`Name`)}
      {stringField('base_path', t`Base Path`)}
      
      {stringField('content_guard', t`Content Guard`)}
      
      {formGroup(
        'hidden',
        t`Hidden`,
        t`Whether this distribution should be shown in the content app.`,
        <>
          <Checkbox
            id='hidden'
            isChecked={distribution.hidden}
            label={t`Hidden`}
            onChange={(_event, value) =>
              updateDistribution({ ...distribution, hidden: value })
            }
          />
        </>
      )}

      {formGroup(
        'generate_repo_config',
        t`Generate Repo Config`,
        t`An option specifying whether Pulp should generate *.repo files.`,
        <>
          <Checkbox
            id='generate_repo_config'
            isChecked={distribution.generate_repo_config}
            label={t`Generate Repo Config`}
            onChange={(_event, value) =>
              updateDistribution({
                ...distribution,
                generate_repo_config: value,
              })
            }
          />
        </>
        )}

      {formGroup(
        'pulp_labels',
        t`Labels`,
        t`Pulp labels in the form of 'key:value'.`,
        <>
          <div
            // prevents "N more" clicks from submitting the form
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <PulpLabels
              labels={distribution.pulp_labels}
              updateLabels={(labels) =>
                updateDistribution({ ...distribution, pulp_labels: labels })
              }
            />
          </div>
        </>,
      )}

      {errorMessages['__nofield'] ? (
        <span
          style={{
            color: 'var(--pf-v5-global--danger-color--200)',
          }}
        >
          {errorMessages['__nofield']}
        </span>
      ) : null}

      <ActionGroup key='actions'>
        <Button
          isDisabled={!isValid}
          key='confirm'
          variant='primary'
          onClick={
           () => saveDistribution()
          }
        >
          {t`Save`}
        </Button>
        <Button key='cancel' variant='link' onClick={onCancel}>
          {t`Cancel`}
        </Button>
      </ActionGroup>
    </Form>
  );
};
