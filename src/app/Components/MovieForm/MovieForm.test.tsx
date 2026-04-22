import {describe, it, expect, vi} from "vitest"
import MovieForm from "./MovieForm";
import {render, screen, fireEvent, getByLabelText} from "@testing-library/react";
import { GenresContext } from "../MovieListPage/MovieListPage";
import { mutate } from "swr";
import selectEvent from "react-select-event";

// Mock the createMovie function from the apiClient
const createMovieMock = vi.fn();
vi.mock('@/Services/apiClient.ts', () => ({
    useCreateMovie: () => ({
        createMovie: createMovieMock,
        isCreating: false,
    }),
}));

vi.mock("swr", () => ({
    mutate: vi.fn(),
}));

// Mock the GenresContext to provide a list of genres for testing
function renderWithContext(ui: React.ReactNode) {
    const genresList = [ { value: "action", label: "Action" }, { value: "comedy", label: "Comedy" } ];
    return render(
        <GenresContext.Provider value={genresList}>
            {ui}
        </GenresContext.Provider>
    );
}

describe("MovieForm", () => {

    

    it("renders without crashing", () => {
        renderWithContext(<MovieForm onSubmitted={() => {}} />);
        expect(screen.getByText("Title")).toBeInTheDocument();
    });

    it("renders with initial data", () => {
        renderWithContext(<MovieForm onSubmitted={vi.fn()} />);
        
        expect(screen.getByPlaceholderText("Movie Name")).toHaveValue("");
        expect(screen.getByPlaceholderText("https://")).toHaveValue("");
        expect(screen.getByPlaceholderText("Movie description")).toHaveValue("");
        expect(screen.getByPlaceholderText("Rating")).toHaveValue(0);
        expect(screen.getByPlaceholderText("Minutes")).toHaveValue(0);
        expect(screen.getByLabelText(/release date/i)).toBeInTheDocument();
        expect(screen.getByText("Select Genres")).toBeInTheDocument();
    });

    it("validates form data and shows error messages", async () => {
        renderWithContext(<MovieForm onSubmitted={vi.fn()} />);
        
        const submitButton = screen.getByRole("button", { name: /submit/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText("Title is required.")).toBeInTheDocument();
        expect(await screen.findByText("Invalid URL format.")).toBeInTheDocument();
        expect(await screen.findByText("Select at least one genre to proceed.")).toBeInTheDocument();
        expect(await screen.findByText("Runtime must be at least 1 minute.")).toBeInTheDocument();
        expect(await screen.findByText("Description is required.")).toBeInTheDocument();
        expect(await screen.findByText("Release date cannot be in the future.")).toBeInTheDocument();
    });

    it("resets form data when reset button is clicked", async () => {
        renderWithContext(<MovieForm onSubmitted={() => {}} />);
        

        // Fill some fields
        const titleInput = screen.getByPlaceholderText("Movie Name");
        const urlInput = screen.getByPlaceholderText("https://");
        const descriptionInput = screen.getByPlaceholderText("Movie description");
        const ratingInput = screen.getByPlaceholderText("Rating");
        const durationInput = screen.getByPlaceholderText("Minutes");

        fireEvent.change(titleInput, { target: { value: "Test Movie" } });
        fireEvent.change(urlInput, { target: { value: "https://domain.com/test-movie.jpg" } });
        fireEvent.change(descriptionInput, { target: { value: "This is a test movie." } });
        fireEvent.change(ratingInput, { target: { value: 8.0 } });
        fireEvent.change(durationInput, { target: { value: 120 } });

        // Validates that the fields are filled
        expect(titleInput).toHaveValue("Test Movie");
        expect(urlInput).toHaveValue("https://domain.com/test-movie.jpg");
        expect(descriptionInput).toHaveValue("This is a test movie.");
        expect(ratingInput).toHaveValue(8.0);
        expect(durationInput).toHaveValue(120);

        // Click on reset button
        const resetButton = screen.getByRole("button", { name: /reset/i });
        fireEvent.click(resetButton);

        // Validates that the fields are reset to initial values
        expect(titleInput).toHaveValue("");
        expect(urlInput).toHaveValue("");
        expect(descriptionInput).toHaveValue("");
        expect(ratingInput).toHaveValue(0);
        expect(durationInput).toHaveValue(0);
    });

    it("submits form data when submit button is clicked", async () => {
        const mockOnSubmitted = vi.fn();

        renderWithContext(<MovieForm onSubmitted={mockOnSubmitted} />);
        
        // Fill all required fields with valid data
        fireEvent.change(screen.getByPlaceholderText("Movie Name"), { target: { value: "Test Movie" } });
        fireEvent.change(screen.getByLabelText(/release date/i), { target: { value: "2023-01-01" } });
        fireEvent.change(screen.getByPlaceholderText("https://"), { target: { value: "https://domain.com/test-movie.jpg" } });
        fireEvent.change(screen.getByPlaceholderText("Movie description"), { target: { value: "This is a test movie." } });
        fireEvent.change(screen.getByPlaceholderText("Rating"), { target: { value: 8.0 } });
        fireEvent.change(screen.getByPlaceholderText("Minutes"), { target: { value: 120 } });
        const select = document.querySelector(".select-genres__control") as HTMLElement;
        await selectEvent.select(select, ["Action", "Comedy"]);

        // Click on submit button
        const submitButton = screen.getByRole("button", { name: /submit/i });
        fireEvent.click(submitButton);

        screen.debug();

        expect(createMovieMock).toHaveBeenCalledTimes(1);

        // Validates that createMovie was called with the correct data
        expect(createMovieMock).toHaveBeenCalledWith({
            title: "Test Movie",
            releaseDate: new Date("2023-01-01"),
            imageUrl: "https://domain.com/test-movie.jpg",
            rating: 8.0,
            genres: [ "Action", "Comedy" ],
            duration: 120,
            description: "This is a test movie."
        });

        expect(mutate).toHaveBeenCalledWith("/movies");
        expect(mockOnSubmitted).toHaveBeenCalled();
    });
});