import { toDurationString } from "@/shared/movieData";
import "./MovieDetails.css";
import { useOutletContext } from "react-router-dom";
import { useMovie } from "@/Services/apiClient";
import Header from "../Header/Header";

/** A component that displays detailed information about a movie, including its poster, title, release year, genres, duration, description and rating. */
const MovieDetails = () => {
    const { movieId } = useOutletContext<{ movieId: number | null }>();
    const { content } = useMovie(movieId!);
    const isValidDate = content?.releaseDate instanceof Date && !isNaN(content.releaseDate.getFullYear());
    const isValidDuration = content?.duration ? content.duration > 0 : false;

    return (
        <div className="movie-details">
            <Header />
            <div className="movie-details-content">
                <img src={content?.imageUrl} alt={`${content?.title} poster`} />
                <div className="movie-details-info">
                    <div className="movie-details-title-rate">
                        <h1>{content?.title}</h1>
                        {content?.rating && <p>{content.rating}</p>} 
                    </div>
                    <p className="movie-details-genres">{content?.genres?.map(genre => genre.label).join(", ")}</p>
                    <div className="movie-details-year-duration">
                        {isValidDate && <p>{content?.releaseDate?.getFullYear()}</p>}
                        {isValidDuration && <p>{toDurationString(content?.duration!)}</p>}
                    </div>
                    <p className="movie-details-description">{content?.description}</p>
                </div>
            </div>
        </div>
    );
}

export default MovieDetails;