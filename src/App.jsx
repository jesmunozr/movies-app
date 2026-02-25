import React, { useState } from 'react'
import Counter from './Counter.jsx'
import Search from './Search.jsx'
import Genre from './Genre.jsx'

const App = ({}) => {
  const [queriedMovie, setQueriedMovie] = useState("The Matrix");
  const [selectedGenre, setSelectedGenre] = useState("");

  const appContainer = React.createElement("div", null,
    React.createElement(Counter, { initialValue: "5" }),
    React.createElement(Search, { 
      initialQuery: queriedMovie, 
      onSearch: (query) => {
        console.log("Searching for:", query);
        setQueriedMovie(query);
      } 
    }),
    React.createElement(Genre, { 
      genreList: ["Crime", "Documentary", "Horror", "Comedy"], 
      selectedGenre: selectedGenre, 
      onSelect: (genre) => {
        console.log("Selected genre:", genre);
        setSelectedGenre(genre);
      } 
    })
  );

  return appContainer;
};

export default App
