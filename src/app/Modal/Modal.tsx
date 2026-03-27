import { createPortal } from "react-dom";
import "./Modal.css";

type ModalProps = {
    /** A boolean indicating whether the modal is open or closed. */
    isOpen: boolean;
    /** The title to be displayed at the top of the modal. */
    title: string;
    /** A function to be called when the modal is requested to be closed. */
    onClose: () => void;
    /** The content to be displayed inside the modal. */
    children: React.ReactNode;
};

export default function Modal({ isOpen, title, onClose, children }: ModalProps) {
    if (!isOpen) return null;

    return createPortal(
        <div 
            data-testid="modal-overlay" 
            className="modal-overlay" 
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-tool-bar">
                    <button data-testid="modal-close-button" className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-header">
                    <h2>{title}</h2>
                </div>
                <div className="modal-children" onClick={(e) => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}