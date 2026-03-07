import type { MovieTileProps } from "../MovieTile/MovieTile";
import { toDurationString } from "../utils/movieData";
import "./MovieDetails.css";

/** A component that displays detailed information about a movie, including its poster, title, release year, genres, duration, description and rating. */
const MovieDetails = ({ imageUrl, title, releaseDate, genres, duration, description, rating }: MovieTileProps) => {
    return (
        <div className="movie-details">
            <img src={imageUrl} alt={`${title} poster`} />
            <div className="movie-details-info">
                <div className="movie-details-title-rate">
                    <h1>{title}</h1>
                    <p>{rating}</p>
                </div>
                <p className="movie-details-genres">{genres.join(", ")}</p>
                <div className="movie-details-year-duration">
                    <p>{releaseDate.getFullYear()}</p>
                    <p>{toDurationString(duration)}</p>
                </div>
                <p className="movie-details-description">{description}</p>
            </div>
        </div>
    );
}

export default MovieDetails;