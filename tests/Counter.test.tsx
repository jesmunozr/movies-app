import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import Counter from "../src/Counter.tsx";

it("renders Counter component with initial value", () => {
    render(<Counter initialValue={10} />);
    const counterElement = screen.getByText(/Counter: 10/i);
    expect(counterElement).toBeInTheDocument();
});

it("increments the counter when Increment button is clicked", async () => {
    render(<Counter initialValue={5} />);
    const incrementButton = screen.getByText(/Increment/i);
    await userEvent.click(incrementButton);
    const counterElement = screen.getByText(/Counter: 6/i);
    expect(counterElement).toBeInTheDocument();
});

it("decrements the counter when Decrement button is clicked", async () => {
    render(<Counter initialValue={5} />);
    const decrementButton = screen.getByText(/Decrement/i);
    await userEvent.click(decrementButton);
    const counterElement = screen.getByText(/Counter: 4/i);
    expect(counterElement).toBeInTheDocument();
});
