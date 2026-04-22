import { useState, useEffect } from "react";
import "./Search.css";
import { useOutletContext } from "react-router-dom";
import Header from "../Header/Header";

/** A search component that allows users to input a movie title and submit a search query. */
function Search() {
    const { initialQuery, onSearch } = useOutletContext<{ initialQuery: string, onSearch: (query: string) => void }>();
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
            <Header />
            <div className="search-content">
                <h1>Find Your Movie</h1>
                <div>
                    <input 
                        data-cy="search-input"
                        type="text"
                        defaultValue={initialQuery}
                        placeholder="What do you want to watch?" 
                        onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
                            if (event.key === "Enter" && onSearch) {
                                onSearch(query);
                            }
                        }}
                        onChange={(event) => {
                            setQuery(event.target.value);
                        }}
                    />
                    <button onClick={() => onSearch && onSearch(query)}>Search</button>
                </div>
            </div>
        </div>
    );
}

export default Search;