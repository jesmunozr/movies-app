import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { Sort } from "./Sort";
import userEvent from "@testing-library/user-event";

it("renders Sort component with proper options", () => {
    render(<Sort sortBy="title" onSortChange={() => {}} />);

    expect(screen.getByLabelText("Sort by")).toBeInTheDocument();

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveValue("title");
    expect(options[0]).toHaveTextContent("TITLE");
    expect(options[1]).toHaveValue("releaseDate");
    expect(options[1]).toHaveTextContent("RELEASE DATE");
});

it("calls onSortChange when a new sorting option is selected", async () => {
    const mockOnSortChange = vi.fn();
    render(<Sort sortBy="title" onSortChange={mockOnSortChange} />);

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "releaseDate");

    expect(mockOnSortChange).toHaveBeenCalledTimes(1);
    expect(mockOnSortChange).toHaveBeenCalledWith("releaseDate");
});

it("updates the selected option when a new sorting option is selected", async () => {
    render(<Sort sortBy="title" onSortChange={() => {}} />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("title");

    await userEvent.selectOptions(select, "releaseDate");
    expect(select).toHaveValue("releaseDate");
});

it("renders the Sort component with the initial sortBy value", () => {
    render(<Sort sortBy="releaseDate" onSortChange={() => {}} />);
   
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("releaseDate");
});

it("renders the Sort component with the default sortBy value when an invalid value is provided", () => {
    render(<Sort sortBy="invalidValue" onSortChange={() => {}} />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("title");
});
