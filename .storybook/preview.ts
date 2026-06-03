import type { Decorator, Preview } from '@storybook/react-vite';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';

import '../src/index.css';
import '../src/app/Components/MovieListPage/MovieListPage.css';

initialize();

const withReactQuery: Decorator = (Story) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return createElement(
    QueryClientProvider,
    { client: queryClient },
    createElement(Story)
  );
};

const preview: Preview = {
  decorators: [mswDecorator, withReactQuery],
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