import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request }) => {
    try {
      const formData = await request.formData();
      
      // Personal information
      const firstName = formData.get('firstName')?.toString() || '';
      const lastName = formData.get('lastName')?.toString() || '';
      const email = formData.get('email')?.toString() || '';
      const phone = formData.get('phone')?.toString() || '';
      
      // Service details
      const selectedDate = formData.get('selectedDate')?.toString() || '';
      const selectedTime = formData.get('selectedTime')?.toString() || '';
      const selectedPackageId = formData.get('selectedPackageId')?.toString() || '';
      const lovedOneName = formData.get('lovedOneName')?.toString() || '';
      const specialRequests = formData.get('specialRequests')?.toString() || '';
      
      // Validate required fields
      if (!firstName || !lastName || !email || !phone || !selectedDate || !selectedTime || !selectedPackageId || !lovedOneName) {
        return fail(400, {
          error: true,
          message: 'Please fill out all required fields',
          data: { 
            firstName, 
            lastName, 
            email, 
            phone, 
            selectedDate, 
            selectedTime, 
            selectedPackageId,
            lovedOneName,
            specialRequests 
          }
        });
      }
      
      // Here you would typically send the data to your backend API
      // For example:
      // const response = await fetch('https://api.tributestream.com/schedule', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ 
      //     firstName, 
      //     lastName, 
      //     email, 
      //     phone, 
      //     selectedDate, 
      //     selectedTime, 
      //     selectedPackageId,
      //     lovedOneName,
      //     specialRequests 
      //   })
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to submit scheduling form');
      // }
      
      // For now, we'll just simulate a successful submission
      console.log('Schedule form submission:', { 
        firstName, 
        lastName, 
        email, 
        phone, 
        selectedDate, 
        selectedTime, 
        selectedPackageId,
        lovedOneName,
        specialRequests 
      });
      
      return {
        success: true,
        message: 'Thank you for scheduling your TributeStream. We\'ll be in touch shortly to confirm the details.'
      };
    } catch (error) {
      console.error('Schedule form error:', error);
      
      return fail(500, {
        error: true,
        message: 'There was an error scheduling your TributeStream. Please try again or contact our support team.'
      });
    }
  }
};