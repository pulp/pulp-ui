import type { Preview } from '@storybook/react-webpack5'
import '@patternfly/patternfly/patternfly.scss'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;