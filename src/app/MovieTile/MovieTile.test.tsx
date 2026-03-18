import {render, screen, waitFor} from "@testing-library/react";
import {expect, it, vi} from "vitest";
import userEvent from "@testing-library/user-event";
import MovieTile from "./MovieTile";
import type { MovieTileComponentProps } from "./MovieTile";

describe("MovieTile tests", () => {
    const mockProps: MovieTileComponentProps = {
        title: "Test Movie Title",
        description: "Test Movie Desciption",
        duration: 180,
        genres: ["genre1", "genre2"],
        imageUrl: "movie-poster.jpg",
        releaseDate: new Date(2026, 3, 7),
        rating: 8.5,
        onClick: () => {},
    };

    it("renders MovieTile component with initial movie data", () =>{
    
        render(<MovieTile {...mockProps}/>);

        const moviePoster = screen.getByRole("img") as HTMLImageElement;

        expect(moviePoster.src).toContain(mockProps.imageUrl);
        expect(moviePoster.alt).toBe(mockProps.title.concat(" poster"));
        
        expect(screen.getByText(mockProps.genres.join(", "))).toBeInTheDocument();
        expect(screen.getByText(mockProps.releaseDate.getFullYear())).toBeInTheDocument();
    });

    it("renders MovieTile component with invalid release date", () =>{
        const mockPropsInvalid: MovieTileComponentProps = {
            title: "Test Movie Title",
            description: "Test Movie Desciption",
            duration: 0,
            genres: ["genre1", "genre2"],
            imageUrl: "movie-poster.jpg",
            releaseDate: new Date("yyyy-mm-dd"),
            rating: 8.5,
            onClick: () => {},
        }

        const { container } = render(<MovieTile {...mockPropsInvalid}/>);

        const element = container.querySelector(".release-year");
        expect(element).toBeNull();

        const moviePoster = screen.getByRole("img") as HTMLImageElement;

        expect(moviePoster.src).toContain(mockPropsInvalid.imageUrl);
        expect(moviePoster.alt).toBe(mockPropsInvalid.title.concat(" poster"));
        
        expect(screen.getByText(mockPropsInvalid.genres.join(", "))).toBeInTheDocument();

    });

    it("renders the modal pop up when the button is clicked", async () => {
        const expectedData = ["Edit", "Delete"];

        render(<MovieTile {...mockProps}/>);

        const modalButton = screen.getByRole("button");
        await userEvent.click(modalButton);

        const modalContainer = screen.getByTestId("context-menu") as HTMLDivElement;

        expect(modalContainer).toBeInTheDocument();
        expect(modalContainer.getElementsByTagName("li").length).toBe(2);
        
        const listItems = modalContainer.getElementsByTagName("li");
        for(let i = 0; i < listItems.length; i++){
            expect(listItems.item(i)?.innerHTML).toBe(expectedData[i]);
        }
        
    });

    it("closes the modal pop up when the close button is clicked", async () => {
        render(<MovieTile {...mockProps}/>);

        const modalButton = screen.getByRole("button");
        await userEvent.click(modalButton);

        let modalContainer = screen.getByTestId("context-menu");
        expect(modalContainer).toBeInTheDocument();
        
        const closeButton = modalContainer.getElementsByTagName("button").item(0) as HTMLElement;
        await userEvent.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
        });
        

    });

    it("Calls the callback when the Movie Tile is clicked", async () => {
        const onClickSpy = vi.fn();

        const mockMovie: MovieTileComponentProps = {
            imageUrl: 'test.jpg',
            title: 'Inception',
            releaseDate: new Date('2010-07-16'),
            genres: ['Sci-Fi'],
            duration: 148,
            description: 'A thief who steals corporate secrets...',
            rating: 8.8,
            onClick: () => {}
        };
        
        render(<MovieTile {...mockMovie} onClick={onClickSpy}/>);

        const mainContainer = screen.getByTestId("movie-tile-container");
        await userEvent.click(mainContainer);

        expect(onClickSpy).toHaveBeenCalledTimes(1);
        expect(onClickSpy).toHaveBeenCalledWith({
            imageUrl: mockMovie.imageUrl, 
            title: mockMovie.title, 
            releaseDate: mockMovie.releaseDate, 
            genres: mockMovie.genres, 
            duration: mockMovie.duration, 
            description: mockMovie.description, 
            rating: mockMovie.rating
        });
    });
});