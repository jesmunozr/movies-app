import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import Search from "./Search.tsx";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";

describe("Search Component", () => {

    function withRouterContext(children: React.ReactNode, { context, route = "/" }: { context: any; route?: string }) {
        return (
            <MemoryRouter initialEntries={[route]}>
                <Routes>
                    <Route element={<Outlet context={context} />}>
                        <Route path="/" element={children} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );
    }

    it("renders Search component with initial query", () => {
        render(withRouterContext(<Search />, { context: { initialQuery: "test", onSearch: () => {} } }));
        const inputElement = screen.getByPlaceholderText(/What do you.../i);
        expect(inputElement).toHaveValue("test");
    });

    it("calls onSearch when Enter key is pressed", async () => {
        const user = userEvent.setup();
        const onSearchMock = vi.fn();

        render(withRouterContext(<Search />, { context: { initialQuery: "", onSearch: onSearchMock } }));
        const inputElement = screen.getByPlaceholderText(/What do you.../i);
        await user.type(inputElement, "Inception{Enter}");
        expect(onSearchMock).toHaveBeenCalledWith("Inception");
    });

    it("calls onSearch when Search button is clicked", async () => {
        const user = userEvent.setup();
        const onSearchMock = vi.fn();
        render(withRouterContext(<Search />, { context: { initialQuery: "", onSearch: onSearchMock } }));
        const inputElement = screen.getByPlaceholderText(/What do you.../i);
        const buttonElement = screen.getByText(/Search/i);
        await user.type(inputElement, "Inception");
        await user.click(buttonElement);
        expect(onSearchMock).toHaveBeenCalledWith("Inception");
    });

});