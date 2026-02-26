function Search({initialQuery, onSearch}){
    return (
        <div>
            <h1>Find Your Movie</h1>
            <input 
                id="search-input"
                type="text"
                defaultValue={initialQuery}
                placeholder="What do you want to watch?" 
                onKeyUp={(event) => {
                    if (event.key === "Enter") {
                        onSearch(event.target.value);
                    }
                }}
            />
            <button onClick={() => {
                let movie = document.getElementById("search-input").value;
                onSearch(movie);
            }}>Search</button>
        </div>
    );
}

export default Search;