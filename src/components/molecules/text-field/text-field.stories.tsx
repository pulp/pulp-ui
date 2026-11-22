import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { TextField } from './text-field';

const meta: Meta<typeof TextField> = {
  title: 'Molecules/Text Field',
  component: TextField,
};

type Story = StoryObj<typeof TextField>;

const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    return (
      <TextField
        id='username'
        label='Username'
        onInputChange={(_, v) => setValue(v)}
        value={value}
      />
    );
  },
};

export default meta;
export { Default };
