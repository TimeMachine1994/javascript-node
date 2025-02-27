import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request }) => {
    try {
      const formData = await request.formData();
      
      const name = formData.get('name')?.toString() || '';
      const email = formData.get('email')?.toString() || '';
      const phone = formData.get('phone')?.toString() || '';
      const subject = formData.get('subject')?.toString() || '';
      const message = formData.get('message')?.toString() || '';
      
      // Validate required fields
      if (!name || !email || !message) {
        return fail(400, {
          error: true,
          message: 'Please fill out all required fields',
          data: { name, email, phone, subject, message }
        });
      }
      
      // Here you would typically send the data to your backend API
      // For example:
      // const response = await fetch('https://api.tributestream.com/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ name, email, phone, subject, message })
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to submit contact form');
      // }
      
      // For now, we'll just simulate a successful submission
      console.log('Contact form submission:', { name, email, phone, subject, message });
      
      return {
        success: true,
        message: 'Thank you for your message. We\'ll get back to you shortly.'
      };
    } catch (error) {
      console.error('Contact form error:', error);
      
      return fail(500, {
        error: true,
        message: 'There was an error submitting your message. Please try again.'
      });
    }
  }
};