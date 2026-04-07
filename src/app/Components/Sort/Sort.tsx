import { useState } from "react";
import "./Sort.css";

export interface SortProps {
    /** The current sorting criteria, either "title" or "releaseDate". */
    sortBy: string;
    /** A callback function that is called when the sorting criteria changes. It receives the new sorting criteria as an argument. */
    onSortChange: (sortBy: string) => void;
}

/** A component that allows users to sort movies by title or release date. */
export const Sort = ({ sortBy, onSortChange }: SortProps) => {
    const sortTypes = {
        title: "title",
        releaseDate: "Release Date"
    };
    const [selectedOption, setSelectedOption] = useState(sortBy);

    return (
        <div className="sort-movies">
            <label htmlFor="sort">Sort by</label>
            <select
                data-testid="sort-select"
                id="sort"
                value={selectedOption}
                onChange={(e) =>{ 
                    setSelectedOption(e.target.value);
                    onSortChange(e.target.value);
                }}>
                {
                    (Object.keys(sortTypes) as Array<keyof typeof sortTypes>).map(key => {
                        return <option key={key} value={key}>{sortTypes[key].toUpperCase()}</option>
                    })
                }
            </select>
        </div>
    );
}

export default Sort;