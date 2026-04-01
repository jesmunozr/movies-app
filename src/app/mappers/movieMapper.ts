import type { ApiMovie } from "@/api/models/Movie";
import type { Movie } from "@/domain/models/Movie";

export const mapMovie = (apiMovie: ApiMovie): Movie => {
    return {
        id: apiMovie.id,
        title: apiMovie.title,
        releaseDate: new Date(apiMovie.release_date),
        genres: apiMovie.genres?.map(genre => ({ value: genre.toLowerCase(), label: genre })),
        duration: apiMovie.runtime,
        description: apiMovie.overview,
        rating: apiMovie.vote_average,
        imageUrl: apiMovie.poster_path ? `https://image.tmdb.org/t/p/w500${apiMovie.poster_path}` : undefined,
    };
};

export const mapMovies = (apiMovies: ApiMovie[]): Movie[] => {
    return apiMovies.map(mapMovie);
}