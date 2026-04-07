import { describe, vi, it, expect } from "vitest";
import {render, screen, fireEvent} from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import SortAndFilter from "./SortAndFilter";

describe("SortAndFilter tests", () => {
    const mockGenres = [
        { value: "action", label: "Action" },
        { value: "comedy", label: "Comedy" },
        { value: "drama", label: "Drama" },
        { value: "horror", label: "Horror" },
        { value: "romance", label: "Romance" }
    ];

    it("renders the SortAndFilter component", () => {
        render(<SortAndFilter genresList={mockGenres} />);

        const genreFilterElement = screen.getByText(/all/i);
        expect(genreFilterElement).toBeInTheDocument();

        const sortByElement = screen.getByText(/sort by/i);
        expect(sortByElement).toBeInTheDocument();
    });

    it("calls onSelectedGenre when a genre is selected", async () => {
        const mockOnSelectedGenre = vi.fn();
        const {container} = render(<SortAndFilter genresList={mockGenres} onSelectedGenre={mockOnSelectedGenre} />);

        const genreOption = screen.getByText(/comedy/i);
        await userEvent.click(genreOption);
        expect(mockOnSelectedGenre).toHaveBeenCalledTimes(1);
        expect(mockOnSelectedGenre).toHaveBeenCalledWith({ value: "comedy", label: "Comedy" });
        expect(container.querySelector(".item2")).toBeInTheDocument();
    });

    it("calls onSortChange when a sort option is selected", async () => {
        const mockOnSortChange = vi.fn();
        render(<SortAndFilter genresList={mockGenres} onSortChange={mockOnSortChange} />);

        const sortOptions = await screen.findAllByRole("combobox")
        await userEvent.selectOptions(sortOptions[1], "releaseDate");
        expect(mockOnSortChange).toHaveBeenCalledTimes(1);
        expect(mockOnSortChange).toHaveBeenCalledWith("releaseDate");
    });

});