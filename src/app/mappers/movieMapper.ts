import type { ApiMovie, ApiPageResponse } from "@/api/models/Movie";
import type { Movie, PageResponse } from "@/domain/models/Movie";

export const mapMovie = (apiMovie: ApiMovie): Movie => {
    return {
        id: apiMovie.id,
        title: apiMovie.title,
        releaseDate: new Date(apiMovie.release_date),
        genres: apiMovie.genres.map(genre => ({ value: genre.toLowerCase(), label: genre })),
        duration: apiMovie.runtime,
        description: apiMovie.overview,
        rating: apiMovie.vote_average,
        imageUrl: apiMovie.poster_path ? apiMovie.poster_path : undefined,
    };
};

export const mapMovies = (apiMovies: ApiMovie[]): Movie[] => {
    return apiMovies.map(mapMovie);
}

export const mapToApiMovie = (movie: Movie): ApiMovie => {
    return {
        title: movie.title,
        tagline: movie.title,
        vote_average: movie.rating,
        vote_count: 0,
        release_date: movie.releaseDate!.toISOString().split('T')[0],
        poster_path: movie.imageUrl,
        overview: movie.description,
        budget: 0,
        revenue: 0,
        runtime: movie.duration,
        genres: movie.genres ? movie.genres.map(genre => genre.label) : [],
        id: movie.id || undefined,
    } as ApiMovie;
}

export const mapPageResponse = (apiResponse: ApiPageResponse): PageResponse<Movie> => {
    return {
        data: apiResponse.data.map(mapMovie),
        totalAmount: apiResponse.totalAmount,
        offset: apiResponse.offset,
        limit: apiResponse.limit,
    };
};