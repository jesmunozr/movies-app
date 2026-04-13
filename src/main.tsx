import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MovieListPage from './app/Components/MovieListPage/MovieListPage.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MovieListPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
