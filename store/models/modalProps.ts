export interface SimpleDialogProps {
    open: boolean;
    onClose: (value: string) => void;
    setCurrentStep: (value: string) => void;
    currentStep: string;
    selectedValue: string;
    emailVerified?: boolean;
    onClickSwitch: () => void
}