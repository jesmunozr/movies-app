import { useState, useRef, useEffect, createContext } from 'react'
import Search from '../Search/Search.tsx'
import './MovieListPage.css';
import AddMovie from '../AddMovie/AddMovie.tsx';
import MovieDetails from '../MovieDetails/MovieDetails.tsx';
import MovieTile from '../MovieTile/MovieTile.tsx';
import SortAndFilter from '../SortAndFilter/SortAndFilter.tsx';

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

/** A list of available genres for movies. This is used to populate the genre selection dropdown in the form. */
const genresList: MovieGenreProps[] = [
  { value: "action", label: "Action" },
  { value: "adventure", label: "Adventure" },
  { value: "animation", label: "Animation" },
  { value: "comedy", label: "Comedy" },
  { value: "crime", label: "Crime" },
  { value: "drama", label: "Drama" },
  { value: "family", label: "Family" },
  { value: "fantasy", label: "Fantasy" },
  { value: "history", label: "History" },
  { value: "horror", label: "Horror" },
  { value: "music", label: "Music" },
  { value: "mystery", label: "Mystery" },
  { value: "romance", label: "Romance" },
  { value: "science fiction", label: "Science Fiction" },
  { value: "thriller", label: "Thriller" },
  { value: "war", label: "War" },
  { value: "western", label: "Western" }
];

export const GenresContext = createContext<MovieGenreProps[]>(genresList);

function MovieListPage({initialMovies = []}: {initialMovies?: MovieProps[]}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [activeGenre, setActiveGenre] = useState<MovieGenreProps>({value: "all", label: "All"});
  const [movies, setMovies] = useState<MovieProps[]>(initialMovies);
  const [selectedMovie, setSelectedMovie] = useState<MovieProps | null>(null);

  /** This ref is used to reference the header element in the DOM. It allows us to manipulate the header's CSS classes based on whether a movie is selected or not. */
  const headerRef = useRef<HTMLHeadingElement | null>(null);
  // const selectedGenreRef = useRef<HTMLDivElement | null>(null);

  /** This function is responsible for handling the selection of a movie. It updates the selectedMovie state and adds a CSS class to the header element if a movie is selected. If no movie is selected, it removes the CSS class from the header element. */
  const handleSelectedMovie = (movie: MovieProps | null) => {
    console.log("Selected movie: ", movie);
    setSelectedMovie(movie);
    if (headerRef.current && movie) {
      headerRef.current.classList.add("movie-selected");
    }
    else{
      headerRef.current!.classList.remove("movie-selected");
    }
  };

  const handleGenreChange = (genre: MovieGenreProps) => {
    setActiveGenre(genre);
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  }

  useEffect(() => {
    setMovies([
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
    ]);
  }, []);

  return (
    <>
      <header ref={headerRef}>
        <div className='app-title'>
          <h1>
            <span className="netflix-title">netflix</span>
            <span>roulette</span>
          </h1>
          {
            selectedMovie ?
              <button className='back-to-search' onClick={() => handleSelectedMovie(null)}>
                <svg viewBox="0 0 512 512">
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                </svg>
              </button> :
              <AddMovie />
          }
        </div>
        <div className="header-content">
          {
            selectedMovie ?
              <MovieDetails
                {...selectedMovie} /> :
              <Search
                initialQuery={searchQuery}
                onSearch={(query: string) => {
                  setSearchQuery(query);
                }} />
          }

        </div>
      </header>
      <main>
        <section className="sort-section">
          <SortAndFilter genresList={genresList} onSelectedGenre={handleGenreChange} onSortChange={handleSortChange} />
        </section>
        <section className="movie-list">
          <GenresContext.Provider value={genresList}>
            {movies.map((movie, index) => (
              <MovieTile key={index} {...movie} onClick={handleSelectedMovie} />
            ))}
          </GenresContext.Provider>
        </section>
      </main>
    </>
  );}

export default MovieListPage
