import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MovieListPage from './app/Components/MovieListPage/MovieListPage.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Search from './app/Components/Search/Search'
import MovieDetails from './app/Components/MovieDetails/MovieDetails.tsx'
import AddMovieForm from './app/Components/AddMovieForm/AddMovieForm.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MovieListPage />}>
          <Route index element={<Search />}/>
          <Route path="new" element={<AddMovieForm />} />
          <Route path="/:movieId">
            <Route index element={<MovieDetails />} />
            <Route path="edit" element={<AddMovieForm />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
