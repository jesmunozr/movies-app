import {render, screen, fireEvent} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import Modal from './Modal';
import userEvent from '@testing-library/user-event';

describe("Modal", () => {
    it("renders the modal when isOpen is true", () => {
        const onCloseSpy = vi.fn();
        render(
            <Modal isOpen={true} title="Test Modal" onClose={onCloseSpy}>
                <p>Modal Content</p>
            </Modal>
        );

        expect(screen.getByText("Modal Content")).toBeInTheDocument();
    });

    it("does not render the modal when isOpen is false", () => {
        const onCloseSpy = vi.fn();
        render(
            <Modal isOpen={false} title="Test Modal" onClose={onCloseSpy}>
                <p>Modal Content</p>
            </Modal>
        );

        expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
    });

    it("calls onClose when the overlay is clicked", () => {
        const onCloseSpy = vi.fn();
        render(
            <Modal isOpen={true} title="Test Modal" onClose={onCloseSpy}>
                <p>Modal Content</p>
            </Modal>
        );

        const overlay = screen.getByText("Modal Content").parentElement?.parentElement?.parentElement;

        if (overlay) {
            fireEvent.click(overlay);
        }

        expect(onCloseSpy).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when the close button is clicked", () => {
        const onCloseSpy = vi.fn();
        render(
            <Modal isOpen={true} title="Test Modal" onClose={onCloseSpy}>
                <p>Modal Content</p>
            </Modal>
        );

        const closeButton = screen.getByTestId("modal-close-button");
        fireEvent.click(closeButton);

        expect(onCloseSpy).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose when the modal content is clicked", () => {
        const onCloseSpy = vi.fn();
        render(
            <Modal isOpen={true} title="Test Modal" onClose={onCloseSpy}>
                <p>Modal Content</p>
            </Modal>
        );

        const modalContent = screen.getByText("Modal Content").parentElement?.parentElement;

        if (modalContent) {
            fireEvent.click(modalContent);
        }

        expect(onCloseSpy).not.toHaveBeenCalled();
    });

    it("renders children correctly", () => {
        const onCloseSpy = vi.fn();
        render(
            <Modal isOpen={true} title="Test Modal" onClose={onCloseSpy}>
                <button>Child Button</button>
            </Modal>
        );

        expect(screen.getByRole("button", { name: "Child Button" })).toBeInTheDocument();
    });

});