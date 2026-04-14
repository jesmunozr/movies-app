import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import Search from './Search';


function RouterWrapper({
  children,
  context,
  initialEntries = ['/'],
}: {
  children: React.ReactNode;
  context: any;
  initialEntries?: string[];
}) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route element={<Outlet context={context} />}>
          <Route path="/" element={children} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

const meta = {
  title: "movies-app/Search",
  component: Search,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Search>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RouterWrapper context={{ initialQuery: "Inception", onSearch: fn() }}>
      <Search />
    </RouterWrapper>
  ),
};

export const EmptyInitialQuery: Story = {
  render: () => (
    <RouterWrapper context={{ initialQuery: "", onSearch: fn() }}>
      <Search />
    </RouterWrapper>
  ),
};

