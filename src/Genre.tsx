function Genre(pt: { genreList: Array<string>, selectedGenre: string, onSelect: (genre: string) => void }) {
    const genresWithPlaceholder = ["", ...pt.genreList];
    return (
        <div>
            <label htmlFor="genre-select">Genre</label>
            <select
                id="genre-select"
                value={pt.selectedGenre}
                onChange={(event) => pt.onSelect(event.target.value)}
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