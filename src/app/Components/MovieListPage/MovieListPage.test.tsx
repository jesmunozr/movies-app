import { describe, it, expect, vi, afterEach } from "vitest";
import {render, screen, fireEvent} from '@testing-library/react';
import { useMoviesInfinite } from "@/Services/apiClient.ts";
import MovieListPage from "./MovieListPage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Search from "../Search/Search";
import MovieDetails from "../MovieDetails/MovieDetails";
import type { Movie } from "@/domain/models/Movie";

vi.mock("@/Services/apiClient.ts", () => ({
    useMoviesInfinite: vi.fn(),
}));

describe("MovieListPage", () => {
    const buildUseMoviesInfiniteResult = (
        overrides: Partial<ReturnType<typeof useMoviesInfinite>> = {}
    ): ReturnType<typeof useMoviesInfinite> => ({
        content: [],
        isLoading: false,
        isError: false,
        loadMore: vi.fn(),
        isReachingEnd: false,
        isFetchingMore: false,
        refresh: vi.fn(),
        ...overrides,
    });

    const mockMovies = [
        {
            imageUrl: "https://example.com/poster1.jpg",
            title: "Movie 1",
            releaseDate: new Date("2022-01-01"),
            genres: [{ label: "Action", value: "action" }, { label: "Adventure", value: "adventure" }],
            duration: 120,
            description: "Description of Movie 1",
            rating: 8.5,
            id: 1,
        },
        {
            imageUrl: "https://example.com/poster2.jpg",
            title: "Movie 2",
            releaseDate: new Date("2023-01-01"),
            genres: [{ label: "Drama", value: "drama" }, { label: "Romance", value: "romance" }],
            duration: 110,
            description: "Description of Movie 2",
            rating: 7.8,
            id: 2,
        }
    ] as Movie[];

    function renderWithRouter(ui: React.ReactElement, { route = "/" } = {}) {
        return render(
            <MemoryRouter initialEntries={[route]}>
                <Routes>
                    <Route path="/" element={ui}>
                        <Route index element={<Search />} />
                        <Route path="/:movieId" element={<MovieDetails />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );
    }

    it("renders the MovieListPage component", async () => {
        const mockedUseMoviesInfinite = vi.mocked(useMoviesInfinite);

        mockedUseMoviesInfinite.mockReturnValue(buildUseMoviesInfiniteResult({
            content: mockMovies,
        }));

        renderWithRouter(<MovieListPage />);

        const searchComponent = screen.getByText(/find your movie/i);
        expect(searchComponent).toBeInTheDocument();

        const genreFilterComponent = screen.getByText(/all/i);
        expect(genreFilterComponent).toBeInTheDocument();

        const sortByComponent = screen.getByText(/sort by/i);
        expect(sortByComponent).toBeInTheDocument();

        expect(screen.getByText(/movie 1/i)).toBeInTheDocument();
        expect(screen.getByText(/movie 2/i)).toBeInTheDocument();
    });

    it("loadMore is not called when isLoading is true", () => {
        const loadMoreMock = vi.fn();

        const mockedUseMoviesInfinite = vi.mocked(useMoviesInfinite);

        mockedUseMoviesInfinite.mockReturnValue(buildUseMoviesInfiniteResult({
            content: undefined,
            isLoading: true,
            isError: false,
            loadMore: loadMoreMock,
        }));

        renderWithRouter(<MovieListPage />);

        expect(loadMoreMock).not.toHaveBeenCalled();
    });

    it("renders a load message when movies are loading", () => {
        const mockedUseMoviesInfinite = vi.mocked(useMoviesInfinite);

        mockedUseMoviesInfinite.mockReturnValue(buildUseMoviesInfiniteResult({
            content: undefined,
            isLoading: true,
            isError: false,
        }));

        renderWithRouter(<MovieListPage />);

        expect(screen.getByText(/loading movies/i)).toBeInTheDocument();
    });

    it("renders an error message when there is an error loading movies", () => {
        const mockedUseMoviesInfinite = vi.mocked(useMoviesInfinite);

        mockedUseMoviesInfinite.mockReturnValue(buildUseMoviesInfiniteResult({
            content: undefined,
            isLoading: false,
            isError: true,
        }));

        renderWithRouter(<MovieListPage />);

        expect(screen.getByText(/failed to load movies/i)).toBeInTheDocument();
    });

    it("calls loadMore when scrolling to the bottom of the page", () => {
        const loadMoreMock = vi.fn();
        const mockedUseMoviesInfinite = vi.mocked(useMoviesInfinite);

        mockedUseMoviesInfinite.mockReturnValue(buildUseMoviesInfiniteResult({
            content: mockMovies,
            isLoading: false,
            isError: false,
            loadMore: loadMoreMock,
        }));

        renderWithRouter(<MovieListPage />);

        // Simulate scrolling to the bottom of the page
        Object.defineProperty(window, "innerHeight", {
            configurable: true,
            value: 1000,
        });

        Object.defineProperty(window, "scrollY", {
            configurable: true,
            value: 1000,
        });

        Object.defineProperty(document.body, "offsetHeight", {
            configurable: true,
            value: 1500,
        });

        fireEvent.scroll(window);

        expect(loadMoreMock).toHaveBeenCalled();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });
});