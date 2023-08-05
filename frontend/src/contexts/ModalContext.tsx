import { useContext, useState, createContext, FunctionComponent, ReactNode } from "react";

interface ModalState {
    isOpen: boolean;
    message: string;
    action: () => void;
}

interface ModalContextProps {
    modalState: ModalState;
    showModal: (message: string, action: () => void) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export function useModalContext(): ModalContextProps {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModalContext must be used within a ModalProvider");
    }
    return context;
}

interface ModalProviderProps {
    children: ReactNode;
}

export const ModalProvider: FunctionComponent<ModalProviderProps> = ({ children }) => {
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        message: "",
        action: () => {},
    });

    const showModal = (message: string, action: () => void) => {
        setModalState({ isOpen: true, message, action });
    };

    const closeModal = () => {
        setModalState({ ...modalState, isOpen: false });
    };

    return (
        <ModalContext.Provider value={{ modalState, showModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};
