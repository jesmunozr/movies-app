import { useState, useEffect } from "react";
import "./Search.css";
import { use } from "chai";

export interface SearchProps {
    /** The initial search query to populate the input field with. */
    initialQuery: string;
    /** A function to be called when the user submits a search query. */
    onSearch: (query: string) => void;
}

/** A search component that allows users to input a movie title and submit a search query. */
function Search({ initialQuery, onSearch }: SearchProps){
    const [query, setQuery] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500); // Debounce delay of 500ms

        return () => clearTimeout(timeout);
    }, [query]);

    useEffect(() => {
        if (debouncedQuery) {
            setQuery(debouncedQuery);
        }
    }, [debouncedQuery]);

    return (
        <div className="search-container">
            <h1>Find Your Movie</h1>
            <div>
                <input 
                    type="text"
                    defaultValue={initialQuery}
                    value={query}
                    placeholder="What do you want to watch?" 
                    onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
                        if (event.key === "Enter") {
                            onSearch(query);
                        }
                    }}
                    onChange={(event) => {
                        setQuery(event.target.value);
                    }}
                />
                <button onClick={() => onSearch(query)}>Search</button>
            </div>
        </div>
    );
}

export default Search;