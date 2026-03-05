import type { MovieTileProps } from "../MovieTile/MovieTile";

const MovieDetails = ({ imageUrl, title, releaseDate, genres, duration, description, rating }: MovieTileProps) => {
    return (
        <div className="movie-details">
            <img src={imageUrl} alt={`${title} poster`} />
            <h1>{title}</h1>
            <p>{rating}</p>
            <p>{genres.join(", ")}</p>
            <p>{releaseDate.getFullYear()}</p>
            <p>{duration} min</p>
            <p>{description}</p>
        </div>
    );
}

export default MovieDetails;