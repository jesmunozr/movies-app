import React from "react";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";

type RenderWithProvidersOptions = {
    route?: string;
    path?: string;
};

export function renderWithProviders(
    ui: React.ReactElement,
    { route = "/", path = "/" }: RenderWithProvidersOptions = {}
) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return {
        queryClient,
        ...render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[route]}>
                    <Routes>
                        <Route path={path} element={ui} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        ),
    };
}
