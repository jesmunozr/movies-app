import { useEffect } from "react";
import Modal from "../Modal/Modal";
import { useLocation, useNavigate } from "react-router-dom";
import MovieForm from "../MovieForm/MovieForm";

function AddMovieForm() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleClose = () => {
        navigate({
            pathname: "/",
            search: location.search
        });
    };

    /** Hide the body overflow when the modal is open */
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);
    
    return (
        <Modal isOpen={true} title={ location.pathname === "/new" ? "Add Movie" : "Edit Movie" } onClose={handleClose}>
            <MovieForm onSubmitted={handleClose}/>
        </Modal>
    );
}

export default AddMovieForm;