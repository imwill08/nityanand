'use client';
import { useState, type FormEvent } from 'react';

export function ContactForm() {
  const [result, setResult] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setResult('Sending....');

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append('access_key', '7bb16dcb-0c5b-4e0f-af7f-fab4a99739d9');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setResult('Form Submitted Successfully');
        form.reset();
      } else {
        setStatus('error');
        setResult(data.message || 'Error');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus('error');
      setResult('Error submitting form. Please check your connection and try again.');
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="hidden" name="access_key" value="7bb16dcb-0c5b-4e0f-af7f-fab4a99739d9" />
      <h3>Reach out to me</h3>
      <label>
        Full name
        <input name="name" type="text" required autoComplete="name" placeholder="Your name" />
      </label>
      <label>
        Email
        <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
      </label>
      <label>
        Message
        <textarea name="message" required placeholder="Tell me about your project" />
      </label>
      <button className="send" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending....' : 'Submit Form'}
      </button>
      {result && (
        <span
          style={{
            display: 'block',
            marginTop: '14px',
            fontSize: '13px',
            fontWeight: 600,
            textAlign: 'center',
            color: status === 'success' ? '#15803d' : status === 'error' ? '#b91c1c' : '#4b5563',
            lineHeight: 1.4,
          }}
          aria-live="polite"
        >
          {result}
        </span>
      )}
    </form>
  );
}

export default ContactForm;
