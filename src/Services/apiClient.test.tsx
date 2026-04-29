import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { type ReactNode } from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCreateMovie, useDeleteMovie, useMovie, useMoviesInfinite, useUpdateMovie } from "@/Services/apiClient";
import type { ApiMovie, ApiPageResponse, ApiRequestParams } from "@/api/models/Movie";
import type { Movie } from "@/domain/models/Movie";
import { config } from "@/config/config";

function makeApiMovie(id: number, overrides: Partial<ApiMovie> = {}): ApiMovie {
    return {
        id,
        title: `Movie ${id}`,
        tagline: `Movie ${id}`,
        vote_average: 7.5,
        vote_count: 100,
        release_date: "2023-01-01",
        poster_path: `https://example.com/${id}.jpg`,
        overview: `Overview ${id}`,
        budget: 0,
        revenue: 0,
        runtime: 120,
        genres: ["Action"],
        ...overrides,
    };
}

function makeMoviesPage(data: ApiMovie[], offset = 0): ApiPageResponse {
    return {
        data,
        totalAmount: data.length,
        offset,
        limit: 12,
    };
}

function makeResponse(ok: boolean, data?: unknown): Response {
    return {
        ok,
        json: async () => data,
    } as Response;
}

function createHookWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false, retryDelay: 0 },
            mutations: { retry: false },
        },
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    return { wrapper, queryClient };
}

describe("apiClient hooks", () => {
    const fetchMock = vi.fn();

    beforeEach(() => {
        vi.stubGlobal("fetch", fetchMock);
        fetchMock.mockReset();
        vi.spyOn(console, "error").mockImplementation(() => undefined);
        vi.spyOn(console, "log").mockImplementation(() => undefined);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("useMovie does not fetch when id is undefined", () => {
        const { wrapper } = createHookWrapper();

        const { result } = renderHook(() => useMovie(undefined), { wrapper });

        expect(result.current.content).toBeUndefined();
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("useMovie fetches a movie by id and maps API data", async () => {
        const { wrapper } = createHookWrapper();
        fetchMock.mockResolvedValue(makeResponse(true, makeApiMovie(10, { genres: ["Action", "Comedy"] })));

        const { result } = renderHook(() => useMovie(10), { wrapper });

        await waitFor(() => {
            expect(result.current.content?.id).toBe(10);
        });

        expect(fetchMock).toHaveBeenCalledWith(`${config.apiBaseUrl}/movies/10`);
        expect(result.current.content?.genres?.map((genre) => genre.label)).toEqual(["Action", "Comedy"]);
        expect(result.current.content?.releaseDate).toBeInstanceOf(Date);
    });

    it("useMovie sets isError when API returns non-ok response", async () => {
        const { wrapper } = createHookWrapper();
        fetchMock.mockResolvedValue(makeResponse(false));

        const { result } = renderHook(() => useMovie(10), { wrapper });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });
    });

    it("useMoviesInfinite fetches first page and maps movies", async () => {
        const { wrapper } = createHookWrapper();
        const params: ApiRequestParams = {
            filter: "action",
            search: "batman",
            searchBy: "title",
            sortBy: "title",
            sortOrder: "asc",
            limit: 12,
            offset: 0,
        };

        fetchMock.mockResolvedValue(makeResponse(true, makeMoviesPage([makeApiMovie(1), makeApiMovie(2)])));

        const { result } = renderHook(() => useMoviesInfinite(params), { wrapper });

        await waitFor(() => {
            expect(result.current.content).toHaveLength(2);
        });

        const requestUrl = String(fetchMock.mock.calls[0][0]);
        expect(requestUrl).toContain("/movies?");
        expect(requestUrl).toContain("search=batman");
        expect(requestUrl).toContain("filter=action");
        expect(requestUrl).toContain("limit=12");
        expect(requestUrl).toContain("offset=0");
        expect(result.current.content[0].id).toBe(1);
    });

    it("useMoviesInfinite loads more pages when loadMore is called", async () => {
        const { wrapper } = createHookWrapper();
        const params: ApiRequestParams = {
            filter: "",
            search: "",
            searchBy: "title",
            sortBy: "title",
            sortOrder: "asc",
            limit: 12,
            offset: 0,
        };

        const firstPage = Array.from({ length: 12 }, (_, index) => makeApiMovie(index + 1));
        const secondPage = [makeApiMovie(13)];

        fetchMock
            .mockResolvedValueOnce(makeResponse(true, makeMoviesPage(firstPage, 0)))
            .mockResolvedValueOnce(makeResponse(true, makeMoviesPage(secondPage, 12)));

        const { result } = renderHook(() => useMoviesInfinite(params), { wrapper });

        await waitFor(() => {
            expect(result.current.content).toHaveLength(12);
        });

        await act(async () => {
            await result.current.loadMore();
        });

        await waitFor(() => {
            expect(result.current.content).toHaveLength(13);
        });

        const secondRequestUrl = String(fetchMock.mock.calls[1][0]);
        expect(secondRequestUrl).toContain("offset=12");
    });

    it("useMoviesInfinite exposes error state when API fails", async () => {
        const { wrapper } = createHookWrapper();
        const params: ApiRequestParams = {
            filter: "",
            search: "",
            searchBy: "title",
            sortBy: "title",
            sortOrder: "asc",
            limit: 12,
            offset: 0,
        };

        fetchMock.mockResolvedValue(makeResponse(false));

        const { result } = renderHook(() => useMoviesInfinite(params), { wrapper });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });
    });

    it("useCreateMovie sends POST request and stores created movie in cache", async () => {
        const { wrapper, queryClient } = createHookWrapper();
        const payload: Omit<Movie, "id"> = {
            title: "New Movie",
            releaseDate: new Date("2023-01-01"),
            genres: [{ value: "action", label: "Action" }],
            duration: 100,
            description: "Test",
            rating: 8.5,
            imageUrl: "https://example.com/new.jpg",
        };

        fetchMock.mockResolvedValue(makeResponse(true, makeApiMovie(100, { title: "New Movie" })));

        const { result } = renderHook(() => useCreateMovie(), { wrapper });

        act(() => {
            result.current.createMovie(payload);
        });

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalled();
        });

        const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
        expect(url).toBe(`${config.apiBaseUrl}/movies`);
        expect(options.method).toBe("POST");
        expect(options.headers).toEqual({ "Content-Type": "application/json" });
        expect(String(options.body)).toContain('"title":"New Movie"');
        expect(String(options.body)).toContain('"genres":["Action"]');

        await waitFor(() => {
            const movie = queryClient.getQueryData<Movie>(["movies", "details", 100]);
            expect(movie?.id).toBe(100);
        });
    });

    it("useCreateMovie exposes error when API create fails", async () => {
        const { wrapper } = createHookWrapper();

        fetchMock.mockResolvedValue(makeResponse(false));

        const { result } = renderHook(() => useCreateMovie(), { wrapper });

        act(() => {
            result.current.createMovie({
                title: "Fail Movie",
                releaseDate: new Date("2023-01-01"),
                genres: [{ value: "action", label: "Action" }],
                duration: 100,
                description: "Test",
                rating: 8,
                imageUrl: "https://example.com/new.jpg",
            });
        });

        await waitFor(() => {
            expect(result.current.error).toBeDefined();
        });
    });

    it("useUpdateMovie sends PUT request and updates details cache", async () => {
        const { wrapper, queryClient } = createHookWrapper();
        queryClient.setQueryData(["movies", "details", 5], { id: 5, title: "Old" } as Movie);

        fetchMock.mockResolvedValue(makeResponse(true, makeApiMovie(5, { title: "Updated" })));

        const { result } = renderHook(() => useUpdateMovie(), { wrapper });

        act(() => {
            result.current.updateMovie({
                id: 5,
                title: "Updated",
                releaseDate: new Date("2023-01-01"),
                genres: [{ value: "action", label: "Action" }],
                duration: 100,
                description: "Updated overview",
                rating: 9,
                imageUrl: "https://example.com/5.jpg",
            });
        });

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalled();
        });

        const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
        expect(url).toBe(`${config.apiBaseUrl}/movies`);
        expect(options.method).toBe("PUT");

        await waitFor(() => {
            const movie = queryClient.getQueryData<Movie>(["movies", "details", 5]);
            expect(movie?.title).toBe("Updated");
        });
    });

    it("useUpdateMovie exposes error when API update fails", async () => {
        const { wrapper } = createHookWrapper();
        fetchMock.mockResolvedValue(makeResponse(false));

        const { result } = renderHook(() => useUpdateMovie(), { wrapper });

        act(() => {
            result.current.updateMovie({
                id: 5,
                title: "Updated",
                releaseDate: new Date("2023-01-01"),
                genres: [{ value: "action", label: "Action" }],
                duration: 100,
                description: "Updated overview",
                rating: 9,
                imageUrl: "https://example.com/5.jpg",
            });
        });

        await waitFor(() => {
            expect(result.current.error).toBeDefined();
        });
    });

    it("useDeleteMovie sends DELETE request and removes movie details from cache", async () => {
        const { wrapper, queryClient } = createHookWrapper();
        queryClient.setQueryData(["movies", "details", 7], { id: 7, title: "To delete" } as Movie);

        fetchMock.mockResolvedValue(makeResponse(true));

        const { result } = renderHook(() => useDeleteMovie(), { wrapper });

        act(() => {
            result.current.deleteMovie(7);
        });

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith(`${config.apiBaseUrl}/movies/7`, { method: "DELETE" });
        });

        await waitFor(() => {
            expect(queryClient.getQueryData(["movies", "details", 7])).toBeUndefined();
        });
    });

    it("useDeleteMovie exposes error when API delete fails", async () => {
        const { wrapper } = createHookWrapper();
        fetchMock.mockResolvedValue(makeResponse(false));

        const { result } = renderHook(() => useDeleteMovie(), { wrapper });

        act(() => {
            result.current.deleteMovie(7);
        });

        await waitFor(() => {
            expect(result.current.error).toBeDefined();
        });
    });
});
