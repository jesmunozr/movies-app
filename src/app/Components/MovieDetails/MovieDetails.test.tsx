import {render, screen} from "@testing-library/react";
import {expect, it, vi} from "vitest";
import MovieDetails from "./MovieDetails";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { useMovie } from "@/Services/apiClient";

// Global mock for useMovie hook
vi.mock("@/Services/apiClient", () => ({
    useMovie: vi.fn(),
}));

// Mock implementation for useMovie hook
const mockedUseMovie = vi.mocked(useMovie);

// Data factory function to create movie objects for testing
const createMovie = (overrides = {}) => ({
    title: "Test Movie Title",
    description: "Test Movie Description",
    duration: 180,
    genres: [
    { value: "genre1", label: "Genre 1" },
    { value: "genre2", label: "Genre 2" },
    ],
    imageUrl: "movie-poster.jpg",
    releaseDate: new Date(2026, 3, 7),
    rating: 8.5,
    id: 100,
    ...overrides,
});

// Helper function to render MovieDetails component with router context
function renderWithRouterContext(context: any = { movieId: 100 }) {
    return render (
        <MemoryRouter initialEntries={["/100"]}>
            <Routes>
                <Route element={<Outlet context={context} />}>
                    <Route path="/:movieId" element={<MovieDetails />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
}

describe("MovieDetails component", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders MovieDetail component with initial movie data", () =>{

        mockedUseMovie.mockReturnValue({
            content: createMovie(),
            isLoading: false,
            isError: undefined,
        });

        renderWithRouterContext();

        expect(screen.getByText("Test Movie Title")).toBeInTheDocument();
        expect(screen.getByText("Genre 1, Genre 2")).toBeInTheDocument();
        expect(screen.getByText("2026")).toBeInTheDocument();

        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("src", expect.stringContaining("movie-poster.jpg"));
        expect(img).toHaveAttribute("alt", "Test Movie Title poster");

        expect(screen.getByText("8.5")).toBeInTheDocument();
    });

    it("renders MovieDetail component with invalid release date and duration", () =>{

        mockedUseMovie.mockReturnValue({
            content: createMovie({
                releaseDate: new Date("invalid-date"),
                duration: NaN,
            }),
            isLoading: false,
            isError: undefined,
        });


        renderWithRouterContext();

        expect(screen.queryByText("2026")).not.toBeInTheDocument();
        expect(screen.queryByText(/min/i)).not.toBeInTheDocument()
    });

    it("renders MovieDetail component without rating property", () =>{
        mockedUseMovie.mockReturnValue({
            content: createMovie({
                rating: undefined,
            }),
            isLoading: false,
            isError: undefined,
        });

        renderWithRouterContext();

        expect(screen.queryByText("8.5")).not.toBeInTheDocument();
    });
});