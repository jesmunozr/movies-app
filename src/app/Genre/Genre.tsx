export interface GenreProps {
    /** A list of genres to display in the dropdown. */
    genreList: Array<string>;
    /** The currently selected genre. */
    selectedGenre: string;
    /** A function to be called when the user selects a genre from the dropdown. */
    onSelect: (genre: string) => void;
}

/** A genre selection component that allows users to choose a movie genre from a dropdown list. */
function Genre({ genreList, selectedGenre, onSelect }: GenreProps) {
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