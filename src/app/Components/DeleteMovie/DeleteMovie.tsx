import { useDeleteMovie } from "@/Services/apiClient";
import "./DeleteMovie.css";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../Modal/Modal";

const DeleteMovie = () => {
  const { movieId } = useParams();
  const { deleteMovie, isDeleting, error } = useDeleteMovie();
  const navigate = useNavigate();

  const handleClose = () => {
      navigate({
          pathname: "/",
          search: location.search
      });
  };

  const handleDelete = async () => {
      try {
          await deleteMovie(Number(movieId));
          handleClose();
      } catch (error) {
          console.error("Failed to delete movie:", error);
      }
  };

  return (
    <Modal isOpen={true} title="Delete Movie" onClose={handleClose}>
      <div className="delete-confirmation">
          <p>Are you sure you want to delete this movie?</p>
          <button data-cy="delete-button" className="red-button" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          {error && <p className="error-message">Failed to delete movie. Please try again.</p>}
      </div>
    </Modal>
  );
};

export default DeleteMovie;