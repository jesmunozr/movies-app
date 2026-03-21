import MovieTile from "../MovieTile/MovieTile";
import "./MovieList.css";

export interface MovieProps {
    /** The URL of the movie poster image */
    imageUrl?: string;
    /** The title of the movie */
    title?: string;
    /** The release date of the movie */
    releaseDate?: Date;
    /** The genres of the movie */
    genres?: Array<MovieGenreProps>;
    /** The duration of the movie in minutes */
    duration?: number;
    /** The description of the movie */
    description?: string;
    /** The rating of the movie */
    rating?: number;
};

export interface MovieGenreProps {
    value: string;
    label: string;
};

const MovieList = () => {
    const movies: MovieProps[] = [
        {
            imageUrl: "https://m.media-amazon.com/images/I/71l23P-Lm4L._AC_UF894,1000_QL80_.jpg",
            title: "Movie 1",
            releaseDate: new Date("2022-01-01"),
            genres: [
                { value: "action", label: "Action" },
                { value: "adventure", label: "Adventure" }
            ],
            duration: 120,
            description: "Description of Movie 1",
            rating: 8.5
        },
        {
            imageUrl: "https://images.squarespace-cdn.com/content/v1/51b3dc8ee4b051b96ceb10de/1526316550228-B0K75I48RK0Z7AN3CLP8/promo-teaser-and-poster-for-the-queen-biopic-bohemian-rhapsody",
            title: "Movie 2",
            releaseDate: new Date("2023-01-01"),
            genres: [
                { value: "drama", label: "Drama" },
                { value: "romance", label: "Romance" }
            ],
            duration: 110,
            description: "Description of Movie 2",
            rating: 7.8
        }
    ];

    return (
        <section className="movie-list">
            {movies.map((movie, index) => (
                <MovieTile key={index} {...movie} onClick={(d) => console.log(d)} />
            ))}
        </section>
    );
}

export default MovieList;