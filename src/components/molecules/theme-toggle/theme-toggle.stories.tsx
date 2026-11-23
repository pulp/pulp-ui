import { Divider } from '@patternfly/react-core';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ThemeContext } from '../../../lib/theme/theme-context';
import { ThemeToggle } from './theme-toggle';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Molecules/Theme Toggle',
  component: ThemeToggle,
};

type Story = StoryObj<typeof ThemeToggle>;

const Default: Story = {
  render: () => (
    <div>
      <h1>Light Mode</h1>
      <div style={{ padding: '2rem', background: '#ffffff' }}>
        <ThemeContext.Provider
          value={{
            isDark: false,
            isSystemDefault: false,
            toggleTheme: () => undefined,
          }}
        >
          <ThemeToggle />
        </ThemeContext.Provider>
      </div>
      <Divider />
      <h1 style={{ paddingTop: '20px' }}>Dark Mode</h1>
      <div
        className='pf-v5-theme-dark'
        style={{ padding: '2rem', background: '#1f2128' }}
      >
        <ThemeContext.Provider
          value={{
            isDark: true,
            isSystemDefault: false,
            toggleTheme: () => undefined,
          }}
        >
          <ThemeToggle />
        </ThemeContext.Provider>
      </div>
    </div>
  ),
};

export default meta;
export { Default };
