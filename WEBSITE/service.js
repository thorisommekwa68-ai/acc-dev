const config = window.AQUA_SUPABASE_CONFIG;
const configured = Boolean(
  config?.url &&
  config?.anonKey &&
  !config.url.includes('YOUR_PROJECT_ID') &&
  !config.anonKey.includes('YOUR_SUPABASE_ANON_KEY')
);
const supabase = configured ? window.supabase.createClient(config.url, config.anonKey) : null;

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

const onboardingForm = document.getElementById('onboarding-form');
const onboardingStatus = document.getElementById('onboarding-status');
onboardingForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = document.getElementById('next-step');
  if (!supabase) {
    setFormStatus(onboardingStatus, 'This form is not connected yet. Please contact us by email.', 'error');
    button.disabled = false;
    button.textContent = 'Submit';
    return;
  }

  const values = formValues(onboardingForm);
  const services = new FormData(onboardingForm).getAll('service[]').map(String);
  button.disabled = true;
  button.textContent = 'Submitting…';
  setFormStatus(onboardingStatus, 'Submitting your project enquiry…', 'info');
  try {
    const { error } = await supabase.from('intake_requests').insert({
      kind: 'onboarding',
      name: values.client_name.trim(),
      email: values.client_email.trim(),
      business_name: values.business_name.trim(),
      phone: values.contact_number.trim(),
      location: values.business_location.trim(),
      industry: values.industry,
      services,
      details: {
        business_summary: values.business_summary || '',
        products_services: values.products_services || '',
        primary_customers: values.primary_customers || '',
        business_difference: values.business_difference || '',
        has_website: values.has_website || '',
        website_url: values.website_url || '',
        functionality_needed: values.functionality_needed || '',
        process_improvement: values.process_improvement || ''
      }
    });
    if (error) throw error;
    onboardingForm.reset();
    setFormStatus(onboardingStatus, 'Thank you. Your project enquiry has been received.', 'success');
  } catch (error) {
    setFormStatus(onboardingStatus, `We could not submit your enquiry: ${error.message}`, 'error');
  } finally {
    button.disabled = false;
    button.textContent = 'Submit';
  }
});
