import React from "react";

function Search({initialQuery, onSearch}){
    const [query, setQuery] = React.useState(initialQuery);
    return (
        <div>
            <h1>Find Your Movie</h1>
            <input 
                type="text"
                defaultValue={initialQuery}
                placeholder="What do you want to watch?" 
                onKeyUp={(event) => {
                    if (event.key === "Enter") {
                        onSearch(event.target.value);
                    }
                }}
                onChange={(event) => {
                    setQuery(event.target.value);
                }}
            />
            <button onClick={() => {
                onSearch(query);
            }}>Search</button>
        </div>
    );
}

export default Search;