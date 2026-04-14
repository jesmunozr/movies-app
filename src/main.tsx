import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MovieListPage from './app/Components/MovieListPage/MovieListPage.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Search from './app/Components/Search/Search'
import MovieDetails from './app/Components/MovieDetails/MovieDetails.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MovieListPage />}>
          <Route index element={<Search />} />
          <Route path="/:movieId" element={<MovieDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
