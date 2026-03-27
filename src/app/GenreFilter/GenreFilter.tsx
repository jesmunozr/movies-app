import { useState } from 'react';
import { type MovieGenreProps } from '../MovieListPage/MovieListPage.tsx';
import "./GenreFilter.css";

export interface GenreFilterProps {
    genres: MovieGenreProps[];
    onChanged?: (genre: MovieGenreProps) => void;
}

const GenreFilter = (
    {genres, onChanged}: GenreFilterProps
) => {
    const [selectedGenre, setSelectedGenre] = useState<MovieGenreProps>({value: "all", label: "All"});

    const handleGenreChange = (genre: MovieGenreProps) => {
        setSelectedGenre(genre);
        onChanged && onChanged(genre);
    };

    return (
        <>
            <ul className="genre-filter">
                <li key="all" value="all" onClick={() => handleGenreChange({value: "all", label: "All"})}>All</li>
                {genres && genres.length > 0 && genres.slice(0, 4).map((genre) => (
                    <li key={genre.value} onClick={() => handleGenreChange({value: genre.value, label: genre.label})}>{genre.label}</li>
                ))}
                {
                    genres && genres.length > 4 ? 
                    <select 
                        value={selectedGenre?.value || ""} 
                        onChange={(e) => handleGenreChange({value: e.target.value, label: e.target.options[e.target.selectedIndex].text})}
                    >
                        <option value="">More...</option>
                        {genres && genres.slice(4, genres.length).map((genre) => (
                            <option key={genre.value} value={genre.value}>{genre.label}</option>
                        ))}
                    </select> : null
                }
            </ul>
            
        </>
    );
};

export default GenreFilter;