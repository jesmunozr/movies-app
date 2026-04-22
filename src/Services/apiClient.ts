import useSWR, { mutate } from "swr";
import useSWRInfinite from "swr/infinite";
import useSWRMutation from "swr/mutation";
import { useMemo, useCallback } from "react";
import { config } from "@/config/config";
import type { ApiPageResponse, ApiRequestParams } from "@/api/models/Movie";
import type { Movie, PageResponse } from "@/domain/models/Movie";
import { mapMovie, mapPageResponse, mapToApiMovie } from "@/app/mappers/movieMapper";

const buildMoviesUrl = (params: ApiRequestParams) => {
  const query = new URLSearchParams();

  if (params.search) query.append("search", params.search);
  query.append("searchBy", params.searchBy);

  if (params.filter?.length) {
    query.append("filter", params.filter.join(","));
  }

  query.append("sortBy", params.sortBy);
  query.append("sortOrder", params.sortOrder);
  query.append("offset", params.offset.toString());
  query.append("limit", params.limit.toString());

  return `${config.apiBaseUrl}/movies?${query.toString()}`;
};

async function getMovies(params: ApiRequestParams): Promise<PageResponse<Movie>> {
  const res = await fetch(buildMoviesUrl(params));
  const data: ApiPageResponse = await res.json();
  return mapPageResponse(data);
}

async function getMovieById(url: string): Promise<Movie> {
  const res = await fetch(`${config.apiBaseUrl}${url}`);
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

export function useMovie(id?: number) {
  const key = id ? `/movies/${id}` : null;

  const { data, error, isLoading } = useSWR(key, getMovieById, {
    revalidateOnFocus: false,
  });

  return {
    content: data,
    isLoading,
    isError: error,
  };
}

export function useMoviesInfinite(params: Omit<ApiRequestParams, "offset" | "limit">) {
  const PAGE_SIZE = 12;

  const stableParams = useMemo(
    () => params,
    [
      params.search,
      params.searchBy,
      params.sortBy,
      params.sortOrder,
      params.filter?.join(","),
    ]
  );

  const getKey = useCallback(
    (pageIndex: number, prev: PageResponse<Movie> | null) => {
      if (prev && prev.data.length < PAGE_SIZE) return null;

      return [
        "movies",
        {
          ...stableParams,
          offset: pageIndex * PAGE_SIZE,
          limit: PAGE_SIZE,
        },
      ] as const;
    },
    [stableParams]
  );

  const { data, error, size, setSize, isLoading, mutate: mutatePages } = useSWRInfinite(
    getKey,
    ([_, params]) => getMovies(params),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    content: data
      ? {
          data: data.flatMap((p) => p.data),
          totalAmount: data[0]?.totalAmount ?? 0,
        }
      : undefined,
    isLoading,
    isError: error,
    loadMore: () => setSize((s) => s + 1),
    isReachingEnd: data ? data[data.length - 1]?.data.length < PAGE_SIZE : false,
    mutatePages, // the useSWRInfinite mutate function, useful for cache updates after create/update
  };
}

// function addMovieToLists(newMovie: Movie) {
//   mutate(
//     (key) => Array.isArray(key) && key[0] === "movies",
//     (pages: PageResponse<Movie> | undefined) => {
//       if (!pages) return pages;

//       // Insert at top of first page
//       const [first, ...rest] = pages.data;

//         const result = {
//             ...pages,
//             data: [newMovie, first, ...rest],
//         };
//         return result;
//     },
//     false
//   );
// }

export function useCreateMovie() {
  const { trigger, isMutating } = useSWRMutation(
    "/movies",
    (_, { arg }: { arg: Omit<Movie, "id"> }) => createMovieRequest(arg)
  );

  const createMovie = async (movie: Omit<Movie, "id">) => {
    const created = await trigger(movie);

    // addMovieToLists(created);
    await mutate(`/movies/${created.id}`, created, false);

    return created;
  };

  return { createMovie, isCreating: isMutating };
}

export function useUpdateMovie() {
  const { trigger, isMutating } = useSWRMutation(
    "/movies",
    (_, { arg }: { arg: Movie }) => updateMovieRequest(arg)
  );

  const updateMovie = async (movie: Movie) => {
      const updated = await trigger(movie);

      mutate(`/movies/${updated.id}`, updated, false);

      return updated;
  };

  return { updateMovie, isUpdating: isMutating };
}