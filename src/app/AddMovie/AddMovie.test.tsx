import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AddMovie from "./AddMovie";

describe("AddMovie", () => {
    it("renders the add movie button", () => {
        render(<AddMovie />);
        const button = screen.getByRole("button", { name: /add movie/i });
        expect(button).toBeInTheDocument();
    });

    it("opens the modal when the add movie button is clicked", () => {
        render(<AddMovie />);
        const button = screen.getByRole("button", { name: /add movie/i });
        button.click();
        const modalTitle = screen.getByText(/add movie/i);
        expect(modalTitle).toBeInTheDocument();
    });
});