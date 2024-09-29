import { useState } from 'react';

interface Disclosure {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
}

export default function useDisclosure(defaultOpen = false): Disclosure {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const onOpen = () => setIsOpen(true);

    const onClose = () => setIsOpen(false);

    const onToggle = () => setIsOpen(!isOpen);

    return { isOpen, onOpen, onClose, onToggle };
}
