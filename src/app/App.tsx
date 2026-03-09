import { useState } from 'react'
import Search from './Search/Search.tsx'
import './App.css';
import Sort from './Sort/Sort.tsx';
import MovieList from './MovieList/MovieList.tsx';

function App(){
  const initialQueryMovie: string = "";
  const [queriedMovie, setQueriedMovie] = useState(initialQueryMovie);

  return (
    <>
      <header>
        <div className='app-title'>
          <h1>
            <span className="netflix-title">netflix</span>
            <span>roulette</span>
          </h1>
        </div>
        <div className="header-content">
          <Search 
            initialQuery={queriedMovie}
            onSearch={(query: string) => {
              console.log("Searching for:", query);
              setQueriedMovie(query);
            }} 
          />
        </div>
      </header>
      <main>
        <section className="sort-section">
          <Sort sortBy="" onSortChange={() => {}}/>
        </section>
        <MovieList />
      </main>
    </>
  );
}

export default App
