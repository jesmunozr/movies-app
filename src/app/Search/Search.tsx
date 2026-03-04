import React from "react";

function Search({ initialQuery, onSearch }: { initialQuery: string, onSearch: (query: string) => void }){
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
            <button onClick={() => {
                onSearch(query);
            }}>Search</button>
        </div>
    );
}

export default Search;