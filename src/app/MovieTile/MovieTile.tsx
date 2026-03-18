import React from "react";
import { createPortal } from "react-dom";
import "./MovieTile.css";
import type { MovieTileProps } from "../MovieList/MovieList";
import Modal from "../Modal/Modal";



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
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [coords, setCoords] = React.useState({ top: 0, left: 0 });
    const [modalTitle, setModalTitle] = React.useState("");
    // const [isEditing, setIsEditing] = React.useState(false);
    // const [isDeleting, setIsDeleting] = React.useState(false);
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

        console.log("Menu item clicked:", e.currentTarget.textContent);
        setModalTitle(e.currentTarget.textContent || "");
        setIsModalOpen(true);
        setIsOpen(false);
    };

    React.useEffect(() => {
        document.body.style.overflow = isModalOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isModalOpen]);

    const isValidDate = releaseDate instanceof Date && !isNaN(releaseDate.getFullYear());

    return (
        <div data-testid="movie-tile-container" className="movie-tile" onClick={() => onClick({ imageUrl, title, releaseDate, genres, duration, description, rating })}>
            <img src={imageUrl} alt={`${title} poster`} />
            <div className="movie-tile-info">
                <div>
                    <h2>{title}</h2>
                    {isValidDate && <p className="release-year">{releaseDate.getFullYear()}</p>}
                </div>                
                <p className="genres">{genres.join(", ")}</p>
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
            <Modal isOpen={isModalOpen} title={modalTitle} onClose={() => setIsModalOpen(false)}>
                <p>{title}</p>
            </Modal>
        </div>
    );
}

export default MovieTile;