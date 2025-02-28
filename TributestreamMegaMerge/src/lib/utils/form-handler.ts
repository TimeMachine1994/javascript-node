import type { SubmitFunction } from '@sveltejs/kit';

/**
 * Options for creating a form submission handler
 */
export interface FormOptions {
  /**
   * Called when the form is submitted, before the fetch request is made
   */
  onSubmit?: () => boolean | void;
  
  /**
   * Called when the form submission is successful
   * @param result The data returned from the server
   */
  onSuccess?: (result: any) => void;
  
  /**
   * Called when the form submission fails
   * @param error The error message
   */
  onError?: (error: string) => void;
  
  /**
   * Called after the form submission completes, regardless of success or failure
   */
  onComplete?: () => void;
  
  /**
   * Whether to reset the form after submission
   */
  resetForm?: boolean;
}

/**
 * Creates an enhanced form submission handler with hooks for common actions
 * @param options The form handler options
 * @returns A SvelteKit submit function
 */
export function createFormHandler(options: FormOptions = {}): SubmitFunction {
  return () => {
    // Trigger onSubmit callback
    // If it returns false explicitly, cancel the submission
    if (options.onSubmit && options.onSubmit() === false) {
      return;
    }
    
    return async ({ result, update }) => {
      // Update the form with the result
      await update({ reset: !!options.resetForm });
      
      if (result.type === 'success') {
        // Handle successful response
        if (options.onSuccess) {
          options.onSuccess(result.data);
        }
      } else if (result.type === 'failure') {
        // Handle errors
        if (options.onError) {
          // In SvelteKit's form actions, failure provides data that may contain error information
          const errorMessage = result.data?.message || 'Form submission failed';
          options.onError(errorMessage);
        }
      } else if (result.type === 'error') {
        // Handle unexpected errors
        if (options.onError) {
          options.onError('An unexpected error occurred');
        }
      }
      
      // Always call onComplete
      if (options.onComplete) {
        options.onComplete();
      }
    };
  };
}

/**
 * Creates a submit handler that displays a confirmation dialog before submission
 * @param message The confirmation message to display
 * @param options Additional form handler options
 * @returns A SvelteKit submit function
 */
export function createConfirmFormHandler(
  message: string,
  options: FormOptions = {}
): SubmitFunction {
  return (event) => {
    // Show confirmation dialog
    if (!confirm(message)) {
      // Cancel the submission
      return;
    }
    
    // Trigger onSubmit callback
    // If it returns false explicitly, cancel the submission
    if (options.onSubmit && options.onSubmit() === false) {
      return;
    }
    
    return async ({ result, update }) => {
      // Update the form with the result
      await update({ reset: !!options.resetForm });
      
      if (result.type === 'success') {
        // Handle successful response
        if (options.onSuccess) {
          options.onSuccess(result.data);
        }
      } else if (result.type === 'failure') {
        // Handle errors
        if (options.onError) {
          // In SvelteKit's form actions, failure provides data that may contain error information
          const errorMessage = result.data?.message || 'Form submission failed';
          options.onError(errorMessage);
        }
      } else if (result.type === 'error') {
        // Handle unexpected errors
        if (options.onError) {
          options.onError('An unexpected error occurred');
        }
      }
      
      // Always call onComplete
      if (options.onComplete) {
        options.onComplete();
      }
    };
  };
}