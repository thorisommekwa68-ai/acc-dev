const config = window.AQUA_SUPABASE_CONFIG;
const configured = Boolean(
  config?.url &&
  config?.publishableKey &&
  !config.url.includes('YOUR_PROJECT_ID') &&
  !config.publishableKey.includes('YOUR_SUPABASE_PUBLISHABLE_KEY')
);
const supabaseSDKAvailable = typeof window.supabase?.createClient === 'function';
let supabase = null;
let supabaseInitializationError = '';
if (configured && supabaseSDKAvailable) {
  try {
    supabase = window.supabase.createClient(config.url, config.publishableKey);
  } catch (error) {
    supabaseInitializationError = error?.message || 'Could not initialize the Supabase client.';
    console.error('Could not initialize the Supabase client:', error);
  }
}

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
const submitButton = document.getElementById('contact-submit');
if (submitButton) submitButton.disabled = false;
contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  if (!supabase) {
    const message = !configured
      ? 'This form is not connected. Please contact us by email.'
      : supabaseInitializationError
        ? `The database connection could not start: ${supabaseInitializationError}`
        : 'The secure form service could not be loaded. Please refresh the page or contact us by email.';
    setFormStatus(contactStatus, message, 'error');
    return;
  }

  const values = formValues(contactForm);
  const button = document.getElementById('contact-submit');
  if (button) {
    button.disabled = true;
    button.textContent = 'Sending…';
  }
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
  } catch (error) {
    const reason = error?.message || 'An unexpected database error occurred.';
    setFormStatus(contactStatus, `We could not send your message: ${reason}`, 'error');
    return;
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = 'Send Message';
    }
  }
  contactForm.reset();
  setFormStatus(contactStatus, 'Thank you for contacting Aqua Capricorn Creatives. The designers will be in touch with you shortly.', 'success');
  document.getElementById('service-dialog')?.close();
  document.getElementById('submission-confirmation')?.showModal();
});

if (contactForm) contactForm.dataset.submitHandlerReady = 'true';
