import React from 'react';

const Search = ({initialQuery, onSearch}) => {
    const searchContainer = React.createElement("div", null,
        React.createElement("h1", null, "Find Your Movie"),
        React.createElement(
            "input", 
            { 
                id: "search-input",
                type: "text",
                defaultValue: initialQuery,
                placeholder: "What do you want to watch?", 
                onKeyUp: (event) => {
                    if (event.key === "Enter") {
                        onSearch(event.target.value);
                    }
                }
            }
        ),
        React.createElement(
            "button", 
            { 
                onClick: () => {
                    let movie = document.getElementById("search-input").value; // Reset input to initial query
                    onSearch(movie);
                }
            }, 
            "Search"
        )
    );

    return searchContainer;
};

export default Search;