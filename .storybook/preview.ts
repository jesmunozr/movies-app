import type { Preview } from '@storybook/react-vite';
import { initialize, mswDecorator } from 'msw-storybook-addon';

import '../src/index.css';
import '../src/app/Components/MovieListPage/MovieListPage.css';

initialize();

const preview: Preview = {
  decorators: [mswDecorator],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;