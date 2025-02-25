import type { FormState, PageState } from '$lib/types/home-page';

export class HomePageState {
    pageState = $state<PageState>('home');
    formData = $state<FormState>({
        searchQuery: '',
        fullName: '',
        phoneNumber: '',
        emailAddress: '',
        isSubmitting: false,
        isSearching: false
    });

    slugifiedText = $derived(
        this.formData.searchQuery
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    );

    customLink = $derived(
        `http://www.Tributestream.com/celebration-of-life-for-${this.slugifiedText}`
    );

    resetForm() {
        this.formData = {
            searchQuery: '',
            fullName: '',
            phoneNumber: '',
            emailAddress: '',
            isSubmitting: false,
            isSearching: false
        };
    }

    setPageState(state: PageState) {
        this.pageState = state;
        if (state === 'home') {
            this.resetForm();
        }
    }

    isFormValid(): boolean {
        const { fullName, phoneNumber, emailAddress } = this.formData;
        return !!(
            fullName.trim() &&
            phoneNumber.trim() &&
            emailAddress.trim() &&
            emailAddress.includes('@')
        );
    }

    startSubmitting() {
        this.formData.isSubmitting = true;
    }

    stopSubmitting() {
        this.formData.isSubmitting = false;
    }

    startSearching() {
        this.formData.isSearching = true;
    }

    stopSearching() {
        this.formData.isSearching = false;
    }
}