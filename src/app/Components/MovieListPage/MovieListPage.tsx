import { useState, useRef, createContext, useEffect } from 'react'
import './MovieListPage.css';
import AddMovie from '../AddMovie/AddMovie.tsx';
import MovieTile from '../MovieTile/MovieTile.tsx';
import SortAndFilter from '../SortAndFilter/SortAndFilter.tsx';
import { useMoviesInfinite } from '@/Services/apiClient.ts';
import type { MovieGenre } from '@/domain/models/Movie.ts';
import { mapMovies } from '@/app/mappers/movieMapper.ts';
import type { ApiRequestParams } from '@/api/models/Movie.ts';
import { Outlet, useSearchParams, useNavigate, useParams } from 'react-router-dom';


/** A list of available genres for movies. This is used to populate the genre selection dropdown in the form. */
const genresList: MovieGenre[] = [
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

export const GenresContext = createContext<MovieGenre[]>(genresList);

function MovieListPage() {
  const { movieId } = useParams();
  const [apiRequestresParams, setApiRequestParams] = useState<ApiRequestParams>({
    sortOrder: 'desc',
    sortBy: 'title',
    searchBy: 'title',
    offset: 0,
    limit: 10
  });
  const { content, loadMore, isReachingEnd, isLoading, isError } = useMoviesInfinite(apiRequestresParams);
  const [ searchParams, setSearchParams ] = useSearchParams();
  const navigate = useNavigate();


  /** This ref is used to reference the header element in the DOM. It allows us to manipulate the header's CSS classes based on whether a movie is selected or not. */
  const headerRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const updateApiRequestParams = () => {
      setApiRequestParams((prev) => {
        return {
          ...prev,
          search: getParam("search"),
          sortBy: getParam("sortBy") as 'title' | 'releaseDate' || 'title',
          filter: getParam("filter") === "all" ? undefined : [getParam("filter") || ""],
        };
      });
    };

    updateApiRequestParams();

  }, [searchParams]);

  useEffect(() => {
    if (movieId) {
      handleSelectedMovie(parseInt(movieId));
    }
  }, [movieId]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || isReachingEnd) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadMore!();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  /** This function is responsible for handling the selection of a movie. It updates the selectedMovie state and adds a CSS class to the header element if a movie is selected. If no movie is selected, it removes the CSS class from the header element. */
  const handleSelectedMovie = (movieId: number | null) => {
    console.log("Selected movie ID: ", movieId);
    if (headerRef.current && movieId) {
      headerRef.current.classList.add("movie-selected");
    }
    else{
      headerRef.current!.classList.remove("movie-selected");
    }
    navigate({
        pathname: movieId ? `/${movieId}` : "/",
        search: `?${searchParams.toString()}`
    });
  };

  const handleGenreChange = (genre: MovieGenre) => {
    setParam("filter", genre.value);
  }

  const handleSortChange = (sort: string) => {
    setParam("sortBy", sort);
  }

  const renderMovies = () => {
    if (isError) {
      return <div>Failed to load movies. Please try again later.</div>;
    }
    
    if (isLoading && !content) {
      return <div>Loading movies...</div>;
    }
    
    const movies = mapMovies(content?.data || []);
    
    return movies.map((movie) => (
      <MovieTile key={movie.id} {...movie} onClick={handleSelectedMovie} />
    ));
  };

  const handleSearchQueryChange = (query: string) => {
    setParam("search", query);
  }

  const getParam = (key: string) => {
    return searchParams.get(key) || undefined;
  }
  const setParam = (key: string, value: string) => {

    if(value === undefined || value === null || value === "") {
      const params = new URLSearchParams(searchParams);
      params.delete(key);
      setSearchParams(params);
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    setSearchParams(params);
  }

  return (
    <>
      <header ref={headerRef}>
        <div className='app-title'>
          <h1>
            <span className="netflix-title">netflix</span>
            <span>roulette</span>
          </h1>
          {
            movieId ?
              <button className='back-to-search' onClick={() => handleSelectedMovie(null)}>
                <svg viewBox="0 0 512 512">
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                </svg>
              </button> :
              <AddMovie />
          }
        </div>
        <div className="header-content">
          <Outlet context={
            {
              initialQuery: getParam("search") || "", 
              onSearch: handleSearchQueryChange,
              movieId: movieId ? parseInt(movieId) : null,
            }
          } />
        </div>
      </header>
      <main>
        <section className="sort-section">
          <SortAndFilter genresList={genresList} onSelectedGenre={handleGenreChange} onSortChange={handleSortChange} />
        </section>
        <section className="movie-list">
          <GenresContext.Provider value={genresList}>
          { renderMovies()}
          </GenresContext.Provider>
        </section>
      </main>
      <footer>
        <div className="footer-content">
          <h1>
            <span className="netflix-title">netflix</span>
            <span>roulette</span>
          </h1>
        </div>
      </footer>
    </>
  );}

export default MovieListPage;
