import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import "./AddMovie.css";
import MovieForm from "../MovieForm/MovieForm";

/** A component that renders a button to add a new movie. When the button is clicked, it opens a modal dialog with a form to enter the movie details. The form data is logged to the console when submitted. */
const AddMovie = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    /** Hide the body overflow when the modal is open */
    useEffect(() => {
        document.body.style.overflow = isModalOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isModalOpen]);

    return (
        <>
            <button className="add-movie-button" onClick={() => setIsModalOpen(true)}>
                &#43; Add Movie
            </button>
            <Modal isOpen={isModalOpen} title="Add Movie" onClose={() => setIsModalOpen(false)}>
                <MovieForm onSubmit={(movie) => {
                    console.log(movie);
                    setIsModalOpen(false);
                }} />
            </Modal>
        </>
    );
};

export default AddMovie;