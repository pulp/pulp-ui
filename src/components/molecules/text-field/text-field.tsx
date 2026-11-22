import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  TextInput,
  type TextInputProps,
} from '@patternfly/react-core';
import type { FC, FormEvent } from 'react';
import './text-field.css';

interface TextFieldProps extends Omit<
  TextInputProps,
  'id' | 'name' | 'value' | 'onChange'
> {
  id: string;
  label?: string;
  onInputChange: (_event: FormEvent, value: string) => void;
  isRequired?: boolean;
  error?: string;
  value: string;
}

const TextField: FC<TextFieldProps> = ({
  id,
  label,
  onInputChange,
  isRequired,
  error,
  value,
  ...inputProps
}) => {
  return (
    <FormGroup label={label} fieldId={id} isRequired={isRequired}>
      <TextInput
        id={id}
        {...inputProps}
        className='pulp-text-field'
        onChange={onInputChange}
        validated={error ? 'error' : 'default'}
        aria-describedby={error ? `${id}-error` : undefined}
        value={value}
      />
      {error && (
        <FormHelperText>
          <HelperText>
            <HelperTextItem id={`${id}-error`} variant='error'>
              {error}
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      )}
    </FormGroup>
  );
};

export { TextField };
