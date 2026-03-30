import {describe, it, expect} from "vitest"
import MovieForm from "./MovieForm";
import { type MovieProps } from "../MovieListPage/MovieListPage";
import {render, screen, fireEvent} from "@testing-library/react";

describe("MovieForm", () => {
    it("renders without crashing", () => {
        render(<MovieForm onSubmit={() => {}} />);
        expect(screen.getByText("Title")).toBeInTheDocument();
    });

    it("renders with initial data", () => {
        const initialData: MovieProps = {
            title: "Test Movie",
            description: "This is a test movie.",
            duration: 120,
            genres: [{ value: "action", label: "Action" }, { value: "comedy", label: "Comedy" }],
            imageUrl: "test-movie.jpg",
            releaseDate: new Date(2025, 11, 25),
            rating: 8.0
        };
        render(<MovieForm {...initialData} onSubmit={() => {}} />);
        expect(screen.getByDisplayValue(initialData.title!)).toBeInTheDocument();
        expect(screen.getByDisplayValue(initialData.description!)).toBeInTheDocument();
        expect(screen.getByDisplayValue(initialData.duration!.toString())).toBeInTheDocument();
        expect(screen.getByText(initialData.genres![0].label)).toBeInTheDocument();
        expect(screen.getByText(initialData.genres![1].label)).toBeInTheDocument();
        expect(screen.getByDisplayValue(initialData.imageUrl!)).toBeInTheDocument();
        expect(screen.getByDisplayValue(initialData.releaseDate!.toISOString().split("T")[0])).toBeInTheDocument();
        expect(screen.getByDisplayValue(initialData.rating!.toString())).toBeInTheDocument();
    });

    it("validates form data and shows error messages", () => {
        render(<MovieForm onSubmit={() => {}} />);
        
        const submitButton = screen.getByText("Submit");
        fireEvent.click(submitButton);

        expect(screen.getByText("Title is required.")).toBeInTheDocument();
        expect(screen.getByText("Release date is required.")).toBeInTheDocument();
        expect(screen.getByText("Image URL is required.")).toBeInTheDocument();
        expect(screen.getByText("Rating is required.")).toBeInTheDocument();
        expect(screen.getByText("Select at least one genre to proceed.")).toBeInTheDocument();
        expect(screen.getByText("Duration is required.")).toBeInTheDocument();
        expect(screen.getByText("Description is required.")).toBeInTheDocument();
    });

    it("resets form data when reset button is clicked", async () => {
        const initialData = {
            title: "Test Movie",
            description: "This is a test movie.",
            duration: 120,
            genres: [{ value: "action", label: "Action" }, { value: "comedy", label: "Comedy" }],
            imageUrl: "https://domain.com/test-movie.jpg",
            releaseDate: new Date(2025, 11, 25),
            rating: 8.0
        };
        render(<MovieForm {...initialData} onSubmit={() => {}} />);
        
        const resetButton = screen.getByText("Reset");
        fireEvent.click(resetButton);

        const elements = await screen.findAllByDisplayValue("");
        expect(elements).toHaveLength(7);
    });
});