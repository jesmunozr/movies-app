import { describe, it, expect, vi } from "vitest";
import {render, screen, fireEvent} from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import MovieListPage from "../MovieListPage/MovieListPage";

describe("MovieListPage", () => {
    it("renders the MovieListPage component", () => {
        render(<MovieListPage />);
        
        const searchComponent = screen.getByText(/find your movie/i);
        expect(searchComponent).toBeInTheDocument();

        const genreFilterComponent = screen.getByText(/all/i);
        expect(genreFilterComponent).toBeInTheDocument();

        const sortByComponent = screen.getByText(/sort by/i);
        expect(sortByComponent).toBeInTheDocument();
    });
});