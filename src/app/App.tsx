import { useState } from 'react'
import Counter from './Counter/Counter.tsx'
import Search from './Search/Search.tsx'
import Genre from './Genre/Genre.tsx'
import './App.css';

function App(){
  const initialQueryMovie: string = "The Matrix";
  const [queriedMovie, setQueriedMovie] = useState(initialQueryMovie);
  const [selectedGenre, setSelectedGenre] = useState("");

  return (
    <>
      <Counter initialValue={5} />
      <Search 
        initialQuery={queriedMovie}
        onSearch={(query: string) => {
          console.log("Searching for:", query);
          setQueriedMovie(query);
        }} 
      />
      <Genre 
        genreList={["Crime", "Documentary", "Horror", "Comedy"]} 
        selectedGenre={selectedGenre} 
        onSelect={(genre: string) => {
          console.log("Selected genre:", genre);
          setSelectedGenre(genre);
        }} 
      />
    </>
  );
}

export default App
