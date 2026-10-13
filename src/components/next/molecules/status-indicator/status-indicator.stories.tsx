import { Divider } from '@patternfly/react-core';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { StatusIndicator } from './status-indicator';

const meta: Meta<typeof StatusIndicator> = {
  title: 'Molecules/Status Indicator',
  component: StatusIndicator,
};

type Story = StoryObj<typeof StatusIndicator>;

const Default: Story = {
  render: () => (
    <div>
      <h1>Light Mode</h1>
      <div style={{ padding: '2rem', background: '#ffffff' }}>
        <StatusIndicator
          tone='success'
          text='System Status: Services Operational'
        />
      </div>
      <Divider />
      <h1 style={{ paddingTop: '20px' }}>Dark Mode</h1>
      <div
        className='pf-v5-theme-dark'
        style={{ padding: '2rem', background: '#1f2128' }}
      >
        <StatusIndicator
          tone='success'
          text='System Status: Services Operational'
        />
      </div>
    </div>
  ),
};

export default meta;
export { Default };
