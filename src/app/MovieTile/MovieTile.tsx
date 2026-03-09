import React from "react";
import { createPortal } from "react-dom";
import "./MovieTile.css";

export interface MovieTileProps {
    /** The URL of the movie poster image */
    imageUrl: string;
    /** The title of the movie */
    title: string;
    /** The release date of the movie */
    releaseDate: Date;
    /** The genres of the movie */
    genres: Array<string>;
    /** The duration of the movie in minutes */
    duration: number;
    /** The description of the movie */
    description: string;
    /** The rating of the movie */
    rating?: number;
}

export interface MovieTileComponentProps extends MovieTileProps {
    /** A function to be called when the movie tile is clicked. */
    onClick: (movie: MovieTileProps) => void;
}

/** A component that displays a movie tile with its poster, title, release date year and genres.
 * It also includes an options button that opens a context menu when clicked. */
const MovieTile = ({
    imageUrl, 
    title, 
    releaseDate, 
    genres, 
    duration, 
    description,
    rating,
    onClick
}: MovieTileComponentProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [coords, setCoords] = React.useState({ top: 0, left: 0 });
    const contextMenuWidth = 190;

    const openPortal = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCoords({ top: rect.top, left: rect.left - contextMenuWidth + rect.width });
        setIsOpen(true);
    };

    const isValidDate = releaseDate instanceof Date && !isNaN(releaseDate.getFullYear());

    return (
        <div data-testid="movie-tile-container" className="movie-tile" onClick={() => onClick({ imageUrl, title, releaseDate, genres, duration, description, rating })}>
            <img src={imageUrl} alt={`${title} poster`} />
            <div className="movie-tile-info">
                <h2>{title}</h2>
                {isValidDate && <p className="release-year">{releaseDate.getFullYear()}</p>}
                <p className="genres">{genres.join(", ")}</p>
            </div>
            <button onClick={openPortal}>&#8942;</button>
            {isOpen && createPortal (
                <div data-testid="context-menu" className="movie-tile-context-menu" style={{ position: 'absolute', top: coords.top, left: coords.left, width: `${contextMenuWidth}px` }}>
                    <button onClick={() => setIsOpen(false)}>&#88;</button>
                    <ul>
                        <li>Edit</li>
                        <li>Delete</li>
                    </ul>
                </div>,
                document.body
            )}
        </div>
    );
}

export default MovieTile;