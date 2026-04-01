import type { Movie } from "@/domain/models/Movie";
import "./DeleteMovie.css";

interface DeleteMovieProps extends Movie {
  onDelete: () => void;
}

const DeleteMovie = ({ ...props }: DeleteMovieProps) => {
  return (
    <div className="delete-confirmation">
        <p>Are you sure you want to delete this movie?</p>
        <button className="red-button" onClick={props.onDelete}>Delete</button>
    </div>
  );
};

export default DeleteMovie;