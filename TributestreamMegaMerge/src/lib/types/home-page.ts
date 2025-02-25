export type PageState = 'home' | 'create';

export interface FormState {
    searchQuery: string;
    fullName: string;
    phoneNumber: string;
    emailAddress: string;
    isSubmitting: boolean;
    isSearching: boolean;
}

export interface FormValidation {
    fullName: boolean;
    phoneNumber: boolean;
    emailAddress: boolean;
}

export interface SearchFormProps {
    onSearch: (event: SubmitEvent) => Promise<void>;
    onCreateClick: () => void;
    searchQuery: string;
    isSearching: boolean;
}

export interface CreateFormProps {
    onSubmit: (event: SubmitEvent) => void;
    onBack: () => void;
    formData: FormState;
    customLink: string;
    slugifiedText: string;
    isValid: boolean;
}