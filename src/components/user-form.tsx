import { t } from '@lingui/core/macro';
import {
  ActionGroup,
  Button,
  FormGroup,
  Label,
  TextInput,
} from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { GroupAPI, type UserType } from 'src/api';
import {
  Alert,
  type AlertType,
  DataForm,
  FormFieldHelper,
  HelpButton,
  Typeahead,
} from 'src/components';
import { type ErrorMessagesType, jsxErrorMessage } from 'src/utilities';

interface IProps {
  errorMessages: ErrorMessagesType;
  isMe?: boolean;
  isNewUser?: boolean;
  isReadonly?: boolean;
  onCancel?: () => void;
  saveUser?: () => void;
  updateUser: (user: UserType, errorMesssages: object) => void;
  user: UserType;
}

export const UserForm = ({
  errorMessages,
  isMe,
  isNewUser,
  isReadonly,
  onCancel,
  saveUser,
  updateUser,
  user,
}: IProps) => {
  const [formErrors, setFormErrors] = useState<{ groups: AlertType }>({
    groups: null,
  });
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [searchGroups, setSearchGroups] = useState<
    { name: string; id: number }[]
  >([]);

  useEffect(() => loadGroups(''), []);

  const minLength = 9; // actually counts codepoints, close enough

  const formFields = [
    { id: 'username', title: t`Username` },
    { id: 'first_name', title: t`First name` },
    { id: 'last_name', title: t`Last name` },
    { id: 'email', title: t`Email` },
    !isReadonly && {
      id: 'password',
      title: t`Password`,
      type: 'password',
      placeholder: isNewUser ? '' : '••••••••••••••••••••••',
      formGroupLabelIcon: (
        <HelpButton
          content={t`Create a password using at least ${minLength} characters, including special characters , ex <!@$%>. Avoid using common names or expressions.`}
        />
      ),
    },
  ];
  const requiredFields = ['username', ...(isNewUser ? ['password'] : [])];

  const passwordConfirmGroup = () => (
    <FormGroup
      fieldId='password-confirm'
      isRequired={isNewUser || !!user.password}
      key='confirm-group'
      label={t`Password confirmation`}
    >
      <TextInput
        placeholder={isNewUser ? '' : '••••••••••••••••••••••'}
        validated={
          samePass(user.password, passwordConfirm) ? 'default' : 'error'
        }
        isDisabled={isReadonly}
        id='password-confirm'
        value={passwordConfirm}
        onChange={(_event, value) => {
          setPasswordConfirm(value);
        }}
        type='password'
        autoComplete='off'
      />
      <FormFieldHelper
        variant={samePass(user.password, passwordConfirm) ? 'default' : 'error'}
      >
        {samePass(user.password, passwordConfirm)
          ? null
          : t`Passwords do not match`}
      </FormFieldHelper>
    </FormGroup>
  );

  const readonlyGroups = () =>
    user.groups.length ? (
      <FormGroup
        fieldId='groups'
        key='readonlyGroups'
        label={t`Groups`}
        data-cy='UserForm-readonly-groups'
      >
        {user.groups.map((group) => (
          <Label key={group.name}>{group.name}</Label>
        ))}
      </FormGroup>
    ) : null;

  const editGroups = () => (
    <FormGroup fieldId='groups' key='editGroups' label={t`Groups`}>
      {formErrors.groups ? (
        <Alert title={formErrors.groups.title} variant='danger' isInline>
          {formErrors.groups.description}
        </Alert>
      ) : (
        <Typeahead
          results={searchGroups}
          loadResults={loadGroups}
          onSelect={onSelectGroup}
          placeholderText={t`Select groups`}
          selections={user.groups}
          multiple
          onClear={clearGroups}
          isDisabled={isReadonly}
        />
      )}
      <FormFieldHelper
        variant={'groups' in errorMessages ? 'error' : 'default'}
      >
        {errorMessages['groups']}
      </FormFieldHelper>
    </FormGroup>
  );

  const formButtons = () => (
    <ActionGroup key='actions'>
      <Button
        type='submit'
        isDisabled={
          !isPassValid(user.password, passwordConfirm) || !requiredFilled(user)
        }
      >
        {t`Save`}
      </Button>
      <Button key='cancel' onClick={() => onCancel()} variant='link'>
        {t`Cancel`}
      </Button>
    </ActionGroup>
  );

  const formSuffix = [
    !isReadonly && passwordConfirmGroup(),
    isMe || isReadonly ? readonlyGroups() : editGroups(),
    errorMessages.non_field_errors ? (
      <FormFieldHelper variant='error'>
        {errorMessages.non_field_errors}
      </FormFieldHelper>
    ) : null,
    !isReadonly && formButtons(),
  ];

  return (
    <DataForm
      errorMessages={errorMessages}
      formFields={formFields}
      formSuffix={<>{formSuffix}</>}
      isReadonly={isReadonly}
      model={user}
      requiredFields={requiredFields}
      updateField={(e, v) => updateField(v, e)}
      onSave={() => saveUser()}
    />
  );

  function clearGroups() {
    const newUser = { ...user };
    newUser.groups = [];
    updateUser(newUser, errorMessages);
  }

  function onSelectGroup(event, selection) {
    const newUser = { ...user };

    const i = user.groups.findIndex((g) => g.name === selection);
    if (i === -1) {
      const addedGroup = searchGroups.find((g) => g.name === selection);
      user.groups.push(addedGroup);
    } else {
      user.groups.splice(i, 1);
    }

    updateUser(newUser, errorMessages);
  }

  function loadGroups(name) {
    GroupAPI.list({ name__contains: name, page_size: 5 })
      .then((result) => setSearchGroups(result.data.results))
      .catch((e) => {
        const { status, statusText } = e.response;
        setFormErrors({
          ...formErrors,
          groups: {
            variant: 'danger',
            title: t`Groups list could not be displayed.`,
            description: jsxErrorMessage(status, statusText),
          },
        });
      });
  }

  // confirm is empty, or matches password
  function samePass(pass, confirm) {
    return !confirm || pass === confirm;
  }

  // both passwords missing, or both match
  function isPassValid(pass, confirm) {
    return !(pass || confirm) || pass === confirm;
  }

  function requiredFilled(user) {
    if (isNewUser) {
      return !!user.password && !!user.username;
    } else {
      return !!user.username;
    }
  }

  function updateUserFieldByName(value, field) {
    const newMessages = { ...errorMessages };

    const update = { ...user };
    update[field] = value;
    if (field in newMessages) {
      delete newMessages[field];
    }
    updateUser(update, newMessages);
  }

  function updateField(value, event) {
    updateUserFieldByName(value, event.target.id);
  }
};
