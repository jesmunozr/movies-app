import { useState } from 'react'
import Counter from './Counter.js'
import Search from './Search.js'
import Genre from './Genre.js'

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
