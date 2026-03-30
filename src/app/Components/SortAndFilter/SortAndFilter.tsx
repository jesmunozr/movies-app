import { useRef, useState } from "react";
import GenreFilter from "../GenreFilter/GenreFilter";
import Sort from "../Sort/Sort";
import type { MovieGenreProps } from "../MovieListPage/MovieListPage";
import "./SortAndFilter.css";

interface SortAndFilterProps {
    genresList: MovieGenreProps[];
    onSelectedGenre?: (genre: MovieGenreProps) => void;
    onSortChange?: (sortBy: string) => void;
}

const SortAndFilter = ({genresList, onSelectedGenre, onSortChange}: SortAndFilterProps) => {
    const selectedGenreRef = useRef<HTMLDivElement | null>(null);
    const [activeGenre, setActiveGenre] = useState<MovieGenreProps>({value: "all", label: "All"});
    const [sortBy, setSortBy] = useState<string>("title");

    const handleGenreChange = (genre: MovieGenreProps) => {
        const previousGenre = activeGenre;
        const previousGenreIndex = genresList.findIndex(g => g.value === previousGenre.value) + 1;
        const newGenreIndex = genresList.findIndex(g => g.value === genre.value) + 1;

        if (previousGenreIndex >= 0 && previousGenreIndex <= 4) {
            selectedGenreRef.current?.classList.remove(`item${previousGenreIndex}`);
        }
        else {
            selectedGenreRef.current?.classList.remove("item5");
        }

        if (newGenreIndex >= 0 && newGenreIndex <= 4) {
            selectedGenreRef.current?.classList.add(`item${newGenreIndex}`);
        } 
        else {
            selectedGenreRef.current?.classList.add("item5");
        }

        setActiveGenre(genre);
        onSelectedGenre && onSelectedGenre(genre);
    }
    
    return (
        <div ref={selectedGenreRef} className="saf-container item0">
            <GenreFilter genres={genresList} onChanged={handleGenreChange} />
            <Sort 
                sortBy={sortBy} 
                onSortChange={(sortBy) => {
                    setSortBy(sortBy);
                    onSortChange && onSortChange(sortBy);
                }}
            />
        </div>
    );
};

export default SortAndFilter;