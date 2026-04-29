import { useMemo } from "react";
import { config } from "@/config/config";
import type { ApiPageResponse, ApiRequestParams } from "@/api/models/Movie";
import type { Movie, PageResponse } from "@/domain/models/Movie";
import { mapMovie, mapPageResponse, mapToApiMovie } from "@/app/mappers/movieMapper";
import { useInfiniteQuery, useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const buildMoviesUrl = (params: ApiRequestParams) => {
  const query = new URLSearchParams();

  if (params.search) {
    query.append("search", params.search);
  }
    
  query.append("searchBy", params.searchBy);

  if (params.filter?.length) {
    query.append("filter", params.filter);
  }

  query.append("sortBy", params.sortBy);
  query.append("sortOrder", params.sortOrder);
  query.append("offset", params.offset.toString());
  query.append("limit", params.limit.toString());

  return `${config.apiBaseUrl}/movies?${query.toString()}`;
};

async function getMovies(params: ApiRequestParams): Promise<PageResponse<Movie>> {
  const res = await fetch(buildMoviesUrl(params));

  if (!res.ok) throw new Error("Failed to fetch movies");

  const data: ApiPageResponse = await res.json();
  return mapPageResponse(data);
}

async function getMovieById(movieId: number): Promise<Movie> {
  const res = await fetch(`${config.apiBaseUrl}/movies/${movieId}`);

  if (!res.ok) throw new Error("Failed to fetch movie");

  const data = await res.json();
  return mapMovie(data);
}

async function createMovieRequest(movie: Omit<Movie, "id">): Promise<Movie> {
  const res = await fetch(`${config.apiBaseUrl}/movies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapToApiMovie(movie)),
  });

  if (!res.ok) throw new Error("Failed to create movie");

  return mapMovie(await res.json());
}

async function updateMovieRequest(movie: Movie): Promise<Movie> {
  const res = await fetch(`${config.apiBaseUrl}/movies`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapToApiMovie(movie)),
  });

  if (!res.ok) throw new Error("Failed to update movie");

  return mapMovie(await res.json());
}

async function deleteMovieRequest(movieId: number): Promise<void> {
  const res = await fetch(`${config.apiBaseUrl}/movies/${movieId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete movie");
}

export function useMovie(id?: number) {
  const key = ["movies", "details", id];

  const { data, error, isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => await getMovieById(id!),
    enabled: !!id, // Only run this query if an ID is provided
    retry: id ? 3 : false, // Retry only if ID is provided, otherwise it will fail due to missing ID
  });

  return {
    content: data,
    isLoading: isLoading && !!id,
    isError: !!error,
  };
}

export function useMoviesInfinite(params: ApiRequestParams) {
  const PAGE_SIZE = 12;

  const stableParams = useMemo(
    () => ({
      filter: params.filter || "",
      search: params.search || "",
      searchBy: params.searchBy || "title",
      sortBy: params.sortBy || "title",
      sortOrder: params.sortOrder || "asc",
    }),
    [params]
  );

  const { 
    data, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["movies", "list", stableParams],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getMovies({ 
        ...stableParams, 
        limit: PAGE_SIZE,
        offset: pageParam,
      });
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PAGE_SIZE ? allPages.length * PAGE_SIZE : undefined;
    },
  });

  return {
    content: data?.pages ? data.pages.flat() : [],
    isLoading,
    isError: !!error,
    loadMore: fetchNextPage,
    isReachingEnd: !hasNextPage,
    isFetchingMore: isFetchingNextPage,
    refresh: refetch,
  };
}

export function useCreateMovie() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newMovie: Omit<Movie, "id">) => createMovieRequest(newMovie),
    onSuccess: (createdMovie) => {
      // Invalidates the keys related to movie list
      queryClient.invalidateQueries({ queryKey: ["movies", "list"] });

      // Uses the retorned movie from API to add it into the cache
      queryClient.setQueryData(["movies", "details", createdMovie.id], createdMovie);
    },
    onError: (error) => {
      console.error("Failed to create movie:", error);
    }
  });

  return {
    createMovie: mutation.mutate,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}

export function useUpdateMovie() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (movie: Movie) => updateMovieRequest(movie),
    onSuccess: (updatedMovie) => {
      // Invalidates the keys related to movie list
      queryClient.invalidateQueries({ queryKey: ["movies", "list"] });

      // Uses the retorned movie from API to update it into the cache
      queryClient.setQueryData(["movies", "details", updatedMovie.id], updatedMovie);

      // Invalidate the movie details query to ensure the updated data is fetched
      queryClient.invalidateQueries({ queryKey: ["movies", "details", updatedMovie.id], refetchType: "none" });
    },
    onError: (error) => {
      console.error("Failed to update movie:", error);
    }
  });

  return {
    updateMovie: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}

export function useDeleteMovie() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (movieId: number) => deleteMovieRequest(movieId),
    onSuccess: (_, movieId) => {
      // Invalidates the keys related to movie list
      queryClient.invalidateQueries({ queryKey: ["movies", "list"] });

      // Removes the deleted movie from the cache
      queryClient.removeQueries({ queryKey: ["movies", "details", movieId] });
    },
    onError: (error) => {
      console.error("Failed to delete movie:", error);
    }
  });

  return {
    deleteMovie: mutation.mutate,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
}
