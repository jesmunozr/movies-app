function Genre({genreList, selectedGenre, onSelect}){
    const genresWithPlaceholder = ["", ...genreList];
    return (
        <div>
            <label htmlFor="genre-select">Genre</label>
            <select
                id="genre-select"
                value={selectedGenre}
                onChange={(event) => onSelect(event.target.value)}
            >
                {genresWithPlaceholder.map((genre) => {
                    if (genre === "") {
                        return <option key="placeholder" value="" hidden>Select Genre</option>;
                    }
                    return <option key={genre} value={genre}>{genre}</option>;
                })}
            </select>
        </div>
    );
}

export default Genre;