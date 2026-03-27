import type { MovieProps } from "../MovieListPage/MovieListPage";
import "./DeleteMovie.css";

interface DeleteMovieProps extends MovieProps {
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