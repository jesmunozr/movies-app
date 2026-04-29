import { describe, it, vi, expect, beforeEach } from "vitest";
import DeleteMovie from "./DeleteMovie";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/renderWithProviders";
import { useDeleteMovie } from "@/Services/apiClient";

const navigateMock = vi.fn();

vi.mock("@/Services/apiClient", () => ({
    useDeleteMovie: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

describe("DeleteMovie", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the confirmation message and delete button", () => {
        vi.mocked(useDeleteMovie).mockReturnValue({
            deleteMovie: vi.fn(),
            isDeleting: false,
            error: null,
        });

        renderWithProviders(<DeleteMovie />, { route: "/123/delete", path: "/:movieId/delete" });

        expect(screen.getByText("Are you sure you want to delete this movie?")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    });

    it("calls deleteMovie with movie id and navigates to home on success", async () => {
        const deleteMovieMock = vi.fn().mockResolvedValue(undefined);
        vi.mocked(useDeleteMovie).mockReturnValue({
            deleteMovie: deleteMovieMock,
            isDeleting: false,
            error: null,
        });

        renderWithProviders(<DeleteMovie />, { route: "/321/delete", path: "/:movieId/delete" });

        await userEvent.click(screen.getByRole("button", { name: "Delete" }));

        await waitFor(() => {
            expect(deleteMovieMock).toHaveBeenCalledWith(321);
            expect(navigateMock).toHaveBeenCalledWith({ pathname: "/", search: "" });
        });
    });

    it("disables the delete button and shows deleting state while request is in progress", () => {
        vi.mocked(useDeleteMovie).mockReturnValue({
            deleteMovie: vi.fn(),
            isDeleting: true,
            error: null,
        });

        renderWithProviders(<DeleteMovie />, { route: "/123/delete", path: "/:movieId/delete" });

        expect(screen.getByRole("button", { name: "Deleting..." })).toBeDisabled();
    });

    it("shows error message when API hook reports an error", () => {
        vi.mocked(useDeleteMovie).mockReturnValue({
            deleteMovie: vi.fn(),
            isDeleting: false,
            error: new Error("Delete failed"),
        });

        renderWithProviders(<DeleteMovie />, { route: "/123/delete", path: "/:movieId/delete" });

        expect(screen.getByText("Failed to delete movie. Please try again.")).toBeInTheDocument();
    });

    it("does not navigate when deleteMovie throws", async () => {
        const deleteMovieMock = vi.fn().mockRejectedValue(new Error("network error"));
        vi.mocked(useDeleteMovie).mockReturnValue({
            deleteMovie: deleteMovieMock,
            isDeleting: false,
            error: null,
        });

        renderWithProviders(<DeleteMovie />, { route: "/123/delete", path: "/:movieId/delete" });

        await userEvent.click(screen.getByRole("button", { name: "Delete" }));

        await waitFor(() => {
            expect(deleteMovieMock).toHaveBeenCalledWith(123);
        });
        expect(navigateMock).not.toHaveBeenCalled();
    });
});
