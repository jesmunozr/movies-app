import { useState, createContext, useEffect } from 'react'
import './MovieListPage.css';
import MovieTile from '../MovieTile/MovieTile.tsx';
import SortAndFilter from '../SortAndFilter/SortAndFilter.tsx';
import { useMoviesInfinite } from '@/Services/apiClient.ts';
import type { ApiRequestParams } from '@/api/models/Movie.ts';
import { Outlet, useSearchParams, useNavigate, useParams } from 'react-router-dom';
import type { MovieGenre } from '@/domain/models/Movie.ts';


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
    filter: "",
    limit: 12,
    offset: 0,
    search: "",
    searchBy: 'title',
    sortBy: 'title',
    sortOrder: 'asc',
  });
  const { content, loadMore, isReachingEnd, isLoading, isError } = useMoviesInfinite(apiRequestresParams);
  const [ searchParams, setSearchParams ] = useSearchParams();
  const navigate = useNavigate();


  useEffect(() => {
    const updateApiRequestParams = () => {
      setApiRequestParams((prev) => {
        return {
          ...prev,
          search: getParam("search") || "",
          sortBy: (getParam("sortBy") as 'title' | 'releaseDate') || 'title',
          filter: getParam("filter") === "all" ? "" : getParam("filter") || "",
        };
      });
    };

    updateApiRequestParams();

  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || isReachingEnd) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadMore?.();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, isLoading, isReachingEnd]);

  /** This function is responsible for handling the selection of a movie. It updates the selectedMovie state and adds a CSS class to the header element if a movie is selected. If no movie is selected, it removes the CSS class from the header element. */
  const handleSelectedMovie = (movieId: number | null) => {
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
    
    return content?.map((movie) => (
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
      <Outlet context={
        {
          initialQuery: getParam("search") || "", 
          onSearch: handleSearchQueryChange,
          movieId: movieId ? parseInt(movieId) : null,
        }
      } />
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
