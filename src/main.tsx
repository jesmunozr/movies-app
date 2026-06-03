import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import MovieListPage from './app/Components/MovieListPage/MovieListPage.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import Search from './app/Components/Search/Search';
import MovieDetails from './app/Components/MovieDetails/MovieDetails.tsx';
import AddMovieForm from './app/Components/AddMovieForm/AddMovieForm.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import DeleteMovie from './app/Components/DeleteMovie/DeleteMovie.tsx';

const queryClient = new QueryClient();

declare global {
  interface Window {
    __TANSTACK_REACT_QUERY__:
      import('@tanstack/query-core').QueryClient
  }
}

window.__TANSTACK_REACT_QUERY__ = queryClient;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MovieListPage />}>
            <Route index element={<Search />}/>
            <Route path="new" element={<AddMovieForm />} />
            <Route path=":movieId">
              <Route index element={<MovieDetails />} />
              <Route path="edit" element={<AddMovieForm />} />
              <Route path="delete" element={<DeleteMovie />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
