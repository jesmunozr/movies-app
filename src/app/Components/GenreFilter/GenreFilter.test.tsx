import { describe, it, expect, vi } from "vitest";
import {render, screen, fireEvent} from '@testing-library/react';
import GenreFilter from "./GenreFilter";
import type { MovieGenreProps } from "../MovieListPage/MovieListPage";
import userEvent from "@testing-library/user-event";

describe("GenreFilter", () => {
    const genresList: MovieGenreProps[] = [
        { value: "action", label: "Action" },
        { value: "adventure", label: "Adventure" },
        { value: "animation", label: "Animation" },
        { value: "comedy", label: "Comedy" },
        { value: "crime", label: "Crime" },
        { value: "drama", label: "Drama" },
        { value: "family", label: "Family" },
        { value: "fantasy", label: "Fantasy" },
        { value: "history", label: "History" },
        { value: "horror", label: "Horror" },
        { value: "music", label: "Music" },
        { value: "mystery", label: "Mystery" },
        { value: "romance", label: "Romance" },
        { value: "science fiction", label: "Science Fiction" },
        { value: "thriller", label: "Thriller" },
        { value: "war", label: "War" },
        { value: "western", label: "Western" }
    ];

    it("renders the genre filter component", () => {
        render(<GenreFilter genres={genresList} onChanged={() => {}} />);
        expect(screen.getByText("All")).toBeInTheDocument();
        expect(screen.getByText("Action")).toBeInTheDocument();
        expect(screen.getByText("Adventure")).toBeInTheDocument();
        expect(screen.getByText("Animation")).toBeInTheDocument();
        expect(screen.getByText("Comedy")).toBeInTheDocument();
        expect(screen.getByText("Romance")).toBeInTheDocument();
        expect(screen.getByText("Western")).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("calls onChanged when a genre is selected from the dropdown", async () => {
        const onChangedMock = vi.fn();
        
        render(<GenreFilter genres={genresList} onChanged={onChangedMock} />);
        
        const select = screen.getByRole("combobox");
        await userEvent.selectOptions(select, "romance");
        
        expect(onChangedMock).toHaveBeenCalledTimes(1);
        expect(onChangedMock).toHaveBeenCalledWith({ value: "romance", label: "Romance" });
    });

    it("calls onChanged when 'All' is selected", () => {
        const onChangedMock = vi.fn();
        render(<GenreFilter genres={genresList} onChanged={onChangedMock} />);
        
        const item = screen.getByText(/all/i);
        fireEvent.click(item);
        
        expect(onChangedMock).toHaveBeenCalledTimes(1);
        expect(onChangedMock).toHaveBeenCalledWith({ value: "all", label: "All" });
    });

    it("calls onChanged when a different genre is selected", () => {
        const onChangedMock = vi.fn();
        render(<GenreFilter genres={genresList} onChanged={onChangedMock} />);
        
        const item = screen.getByText(/action/i);
        fireEvent.click(item);
        
        expect(onChangedMock).toHaveBeenCalledTimes(1);
        expect(onChangedMock).toHaveBeenCalledWith({ value: "action", label: "Action" });
    });

    it("displays All when empty genres list is provided", () => {
        const onChangedMock = vi.fn();
        render(<GenreFilter genres={[]} onChanged={onChangedMock} />);
        expect(screen.getByText("All")).toBeInTheDocument();
        expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
        expect(screen.queryByRole("option")).not.toBeInTheDocument();
    });
});