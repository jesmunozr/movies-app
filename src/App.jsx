import { useState } from 'react'
import Counter from './Counter.jsx'
import Search from './Search.jsx'
import Genre from './Genre.jsx'

function App(){
  const initialQueryMovie = "The Matrix";
  const [queriedMovie, setQueriedMovie] = useState(initialQueryMovie);
  const [selectedGenre, setSelectedGenre] = useState("");

  return (
    <>
      <Counter initialValue="5" />
      <Search 
        initialQuery={queriedMovie}
        onSearch={(query) => {
          console.log("Searching for:", query);
          setQueriedMovie(query);
        }} 
      />
      <Genre 
        genreList={["Crime", "Documentary", "Horror", "Comedy"]} 
        selectedGenre={selectedGenre} 
        onSelect={(genre) => {
          console.log("Selected genre:", genre);
          setSelectedGenre(genre);
        }} 
      />
    </>
  );
}

export default App
