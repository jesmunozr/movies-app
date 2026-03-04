import React from "react";

export interface SearchProps {
    /** The initial search query to populate the input field with. */
    initialQuery: string;
    /** A function to be called when the user submits a search query. */
    onSearch: (query: string) => void;
}

/** A search component that allows users to input a movie title and submit a search query. */
function Search({ initialQuery, onSearch }: SearchProps){
    const [query, setQuery] = React.useState(initialQuery);
    return (
        <div>
            <h1>Find Your Movie</h1>
            <input 
                type="text"
                defaultValue={initialQuery}
                placeholder="What do you want to watch?" 
                onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === "Enter") {
                        onSearch(event.currentTarget.value);
                    }
                }}
                onChange={(event) => {
                    setQuery(event.target.value);
                }}
            />
            <button onClick={() => onSearch(query)}>Search</button>
        </div>
    );
}

export default Search;