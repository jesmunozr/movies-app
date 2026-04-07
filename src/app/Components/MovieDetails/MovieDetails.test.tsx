import {render, screen} from "@testing-library/react";
import {expect, it} from "vitest";
import MovieDetails from "./MovieDetails";
import type { MovieProps } from "../MovieListPage/MovieListPage";

it("renders MovieDetail component with initial movie data", () =>{
    const mockProps: MovieProps = {
        title: "Test Movie Title",
        description: "Test Movie Desciption",
        duration: 180,
        genres: [{ value: "genre1", label: "Genre 1" }, { value: "genre2", label: "Genre 2" }],
        imageUrl: "movie-poster.jpg",
        releaseDate: new Date(2026, 3, 7),
        rating: 8.5,
    }
    const {container} = render(<MovieDetails {...mockProps}/>);

    const rateElement = container.querySelector(".movie-details-title-rate p");
    expect(rateElement).not.toBeNull();
    expect(rateElement?.textContent).toBe(mockProps.rating?.toString());

    const moviePoster = screen.getByRole("img") as HTMLImageElement;

    expect(moviePoster.src).toContain(mockProps.imageUrl);
    expect(moviePoster.alt).toBe(mockProps.title?.concat(" poster"));
    
    expect(screen.getByText(mockProps.genres!.map(g => g.label).join(", "))).toBeInTheDocument();
    expect(screen.getByText(mockProps.releaseDate!.getFullYear())).toBeInTheDocument();
});

it("renders MovieDetail component with invalid release date and duration", () =>{
    const mockProps: MovieProps = {
        title: "Test Movie Title",
        description: "Test Movie Desciption",
        duration: 0,
        genres: [{ value: "genre1", label: "Genre 1" }, { value: "genre2", label: "Genre 2" }],
        imageUrl: "movie-poster.jpg",
        releaseDate: new Date("yyyy-mm-dd"),
        rating: 8.5,
    }

    const { container } = render(<MovieDetails {...mockProps}/>);

    const divElement = container.querySelector("movie-details-year-duration");
    expect(divElement?.innerHTML).not.toBeDefined();
});

it("renders MovieDetail component without rating property", () =>{
    const mockProps: MovieProps = {
        title: "Test Movie Title",
        description: "Test Movie Desciption",
        duration: 0,
        genres: [{ value: "genre1", label: "Genre 1" }, { value: "genre2", label: "Genre 2" }],
        imageUrl: "movie-poster.jpg",
        releaseDate: new Date(2026, 3, 7),
    }

    const { container } = render(<MovieDetails {...mockProps}/>);

    const element = container.querySelector(".movie-details-title-rate p");
    expect(element).toBeNull();
});