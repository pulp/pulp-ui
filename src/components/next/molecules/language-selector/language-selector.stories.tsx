import { Divider } from '@patternfly/react-core';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { isLanguageCode } from '../../../../lib/l10n/is-language-code';
import type { LanguageCode } from '../../../../lib/l10n/languages';
import { LanguageSelector } from './language-selector';

const meta: Meta<typeof LanguageSelector> = {
  title: 'Molecules/Language Selector',
  component: LanguageSelector,
};

type Story = StoryObj<typeof LanguageSelector>;

const Default: Story = {
  render: () => {
    const [value, setValue] = useState<LanguageCode>('en');
    return (
      <div>
        <h1>Light Mode</h1>
        <div style={{ padding: '2rem', background: '#ffffff' }}>
          <LanguageSelector
            lang={value}
            onChange={(val) => (isLanguageCode(val) ? setValue(val) : null)}
          />
        </div>
        <Divider />
        <h1 style={{ padding: '2rem' }}>Dark Mode</h1>
        <div
          className='pf-v5-theme-dark'
          style={{ padding: '2rem', background: '#1f2128' }}
        >
          <LanguageSelector
            lang={value}
            onChange={(val) => (isLanguageCode(val) ? setValue(val) : null)}
          />
        </div>
      </div>
    );
  },
};

export default meta;
export { Default };
