import { describe, it, vi, expect } from "vitest";
import DeleteMovie from "./DeleteMovie";
import { render } from "@testing-library/react";

describe("DeleteMovie", () => {
    it("renders the confirmation message and delete button", () => {
        const onDeleteMock = vi.fn();
        const { getByText } = render(
            <DeleteMovie 
                imageUrl="https://example.com/image.jpg"
                title="Example Movie"
                releaseDate={new Date()}
                genres={[{ label: "Action", value: "action" }]}
                duration={120}
                description="Example description"
                rating={5}
                onDelete={onDeleteMock}
            />
        );

        expect(getByText("Are you sure you want to delete this movie?")).toBeInTheDocument();
        expect(getByText("Delete")).toBeInTheDocument();
    });
});
