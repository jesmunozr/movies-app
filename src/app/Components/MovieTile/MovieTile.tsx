import React from "react";
import { createPortal } from "react-dom";
import "./MovieTile.css";
import type { Movie } from "@/domain/models/Movie";
import { useNavigate } from "react-router-dom";

export interface MovieTileComponentProps extends Movie {
    /** A function to be called when the movie tile is clicked. */
    onClick: (movieId: number) => void;
}

/** A component that displays a movie tile with its poster, title, release date year and genres.
 * It also includes an options button that opens a context menu when clicked. */
const MovieTile = ({
    imageUrl, 
    title, 
    releaseDate, 
    genres, 
    id,
    onClick
}: MovieTileComponentProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    //const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [coords, setCoords] = React.useState({ top: 0, left: 0 });
    // const [modalTitle, setModalTitle] = React.useState("");
    const navigate = useNavigate();
    const contextMenuWidth = 190;

    /** Opens the context menu and calculates its position based on the button's location. */
    const openPortal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        
        const rect = e.currentTarget.getBoundingClientRect();
        setCoords({ top: rect.top + window.scrollY, left: rect.left - contextMenuWidth + rect.width });
        setIsOpen(true);
    };

    /** Opens the modal dialog and closes the context menu. */
    const openDialogAndCloseMenu = (e: React.MouseEvent<HTMLLIElement>) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        let targetPath: string | undefined = undefined;

        if (e.currentTarget.textContent === "Edit") {
            targetPath = `/${id}/edit`;
        } else if (e.currentTarget.textContent === "Delete") {
            targetPath = `/${id}/delete`;
        }

        setIsOpen(false); // Close the context menu
        if (targetPath) {
            navigate({
                pathname: targetPath,
                search: location.search
            });
        }
    };

    const isValidDate = releaseDate instanceof Date && !isNaN(releaseDate.getFullYear());

    return (
        <div data-testid="movie-tile-container" className="movie-tile" 
            onClick={(e) => {
                const target = e.target as HTMLElement;

                if (target.closest("button, [data-testid='context-menu']")) return;

                onClick(id!);
            }}
        >
            <img src={imageUrl} alt={`${title}`} />
            <div className="movie-tile-info">
                <div>
                    <h2 data-cy="movie-title">{title}</h2>
                    {isValidDate && <p className="release-year">{releaseDate.getFullYear()}</p>}
                </div>                
                <p className="genres">{genres?.map(genre => genre.label).join(", ")}</p>
            </div>
            <button onClick={openPortal}>&#8942;</button>
            {isOpen && createPortal (
                <div data-testid="context-menu" className="movie-tile-context-menu" style={{ position: 'absolute', top: coords.top, left: coords.left, width: `${contextMenuWidth}px` }}>
                    <button onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                    }}>&#88;</button>
                    <ul>
                        <li onClick={openDialogAndCloseMenu}>Edit</li>
                        <li onClick={openDialogAndCloseMenu}>Delete</li>
                    </ul>
                    
                </div>,
                document.body
            )}
        </div>
    );
}

export default MovieTile;