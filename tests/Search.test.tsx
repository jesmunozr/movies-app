import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import Search from "../src/Search.tsx";

it("renders Search component with initial query", () => {
    render(<Search initialQuery="test" onSearch={() => {}} />);
    const inputElement = screen.getByPlaceholderText(/What do you.../i);
    expect(inputElement).toHaveValue("test");
});

it("calls onSearch when Enter key is pressed", async () => {
    const user = userEvent.setup();
    const onSearchMock = vi.fn();
    render(<Search initialQuery="" onSearch={onSearchMock} />);
    const inputElement = screen.getByPlaceholderText(/What do you.../i);
    await user.type(inputElement, "Inception{Enter}");
    expect(onSearchMock).toHaveBeenCalledWith("Inception");
});

it("calls onSearch when Search button is clicked", async () => {
    const user = userEvent.setup();
    const onSearchMock = vi.fn();
    render(<Search initialQuery="" onSearch={onSearchMock} />);
    const inputElement = screen.getByPlaceholderText(/What do you.../i);
    const buttonElement = screen.getByText(/Search/i);
    await user.type(inputElement, "Inception");
    await user.click(buttonElement);
    expect(onSearchMock).toHaveBeenCalledWith("Inception");
});