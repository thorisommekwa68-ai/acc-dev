const config = window.AQUA_SUPABASE_CONFIG;
const configured = Boolean(
  config?.url &&
  config?.publishableKey &&
  !config.url.includes('YOUR_PROJECT_ID') &&
  !config.publishableKey.includes('YOUR_SUPABASE_PUBLISHABLE_KEY')
);
const supabase = configured ? window.supabase.createClient(config.url, config.publishableKey) : null;

function setFormStatus(element, message, type) {
  element.className = `form-status ${type}`;
  element.textContent = message;
}

function formValues(form) {
  const values = new FormData(form);
  return Object.fromEntries(values.entries());
}

const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  if (!supabase) {
    setFormStatus(contactStatus, 'This form is not connected yet. Please contact us by email.', 'error');
    return;
  }

  const values = formValues(contactForm);
  const button = document.getElementById('contact-submit');
  button.disabled = true;
  button.textContent = 'Sending…';
  setFormStatus(contactStatus, 'Sending your message…', 'info');
  try {
    const { error } = await supabase.from('intake_requests').insert({
      kind: 'contact',
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      category: values.category,
      message: values.message.trim()
    });
    if (error) throw error;
    contactForm.reset();
    setFormStatus(contactStatus, 'Thank you. Your message has been sent to Aqua Capricorn Creatives.', 'success');
  } catch (error) {
    setFormStatus(contactStatus, `We could not send your message: ${error.message}`, 'error');
  } finally {
    button.disabled = false;
    button.textContent = 'Send Message';
  }
});
