import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import Genre from "../src/Genre.tsx";

it("renders all genres passed in genreList parameter", () => {
    const genreList = ["Action", "Comedy", "Drama"];
    render(<Genre genreList={genreList} selectedGenre="" onSelect={() => {}} />);
    genreList.forEach((genre) => {
        const optionElement = screen.getByRole("option", { name: genre });
        expect(optionElement).toBeInTheDocument();
    });
});

it("renders the selected genre pased in selectedGenre parameter", () => {
    const genreList = ["Action", "Comedy", "Drama"];
    const selectedGenre = "Comedy";
    render(<Genre genreList={genreList} selectedGenre={selectedGenre} onSelect={() => {}} />);
    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toHaveValue(selectedGenre);
});

it("calls onSelect callback when a genre is selected", async () => {
    const user = userEvent.setup();
    const genreList = ["Action", "Comedy", "Drama"];
    const onSelectMock = vi.fn();
    render(<Genre genreList={genreList} selectedGenre="" onSelect={onSelectMock} />);
    const selectElement = screen.getByRole("combobox");
    await user.selectOptions(selectElement, "Drama");
    expect(onSelectMock).toHaveBeenCalledWith("Drama");
});