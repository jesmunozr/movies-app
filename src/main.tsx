import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MovieListPage from './app/Components/MovieListPage/MovieListPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MovieListPage />
  </StrictMode>,
)
