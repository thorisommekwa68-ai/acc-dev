const config = window.AQUA_SUPABASE_CONFIG;
const configured = Boolean(
  config?.url &&
  config?.publishableKey &&
  !config.url.includes('axxshvoizftbezkxdisv') &&
  !config.publishableKey.includes('sb_publishable_NyF6_0NZBBZG6ByLe0OVsw_LSFBtVdW')
);

const supabaseSDKAvailable = typeof window.supabase?.createClient === 'function';
let supabase = null;
let supabaseInitializationError = '';

if (configured && supabaseSDKAvailable) {
  try {
    supabase = window.supabase.createClient(config.url, config.publishableKey);
  } catch (error) {
    supabaseInitializationError = error?.message || 'Could not initialize the Supabase client.';
    console.error('Supabase init error:', error);
  }
}

function setFormStatus(element, message, type) {
  if (!element) return;
  element.className = `form-status ${type}`;
  element.textContent = message;
}

function formatDatabaseError(error) {
  if (!error) return 'An unexpected database error occurred.';
  const parts = [
    error.message,
    error.details ? `Details: ${error.details}` : '',
    error.hint ? `Hint: ${error.hint}` : '',
    error.code ? `(Code: ${error.code})` : ''
  ].filter(Boolean);
  return parts.join(' — ');
}

async function insertViaRestFallback(payload) {
  const response = await fetch(`${config.url}/rest/v1/intake_requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': config.publishableKey,
      'Authorization': `Bearer ${config.publishableKey}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let errBody = {};
    try {
      errBody = await response.json();
    } catch (_) {}
    throw {
      message: errBody.message || `HTTP ${response.status} ${response.statusText}`,
      details: errBody.details,
      hint: errBody.hint,
      code: errBody.code
    };
  }
}

const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');

const initialButton = document.getElementById('contact-submit');
if (initialButton) initialButton.disabled = false;

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  if (!configured) {
    setFormStatus(contactStatus, 'This form is not connected. Please contact us by email.', 'error');
    return;
  }

  const raw = Object.fromEntries(new FormData(contactForm).entries());
  const payload = {
    kind: 'contact',
    name: (raw.name || '').trim().slice(0, 160),
    email: (raw.email || '').trim().slice(0, 320),
    subject: (raw.subject || '').trim().slice(0, 300),
    category: raw.category || 'Other',
    message: (raw.message || '').trim().slice(0, 10000)
  };

  const button = document.getElementById('contact-submit');
  if (button) {
    button.disabled = true;
    button.textContent = 'Sending…';
  }
  setFormStatus(contactStatus, 'Sending your message…', 'info');

  try {
    if (supabase) {
      const { error } = await supabase.from('intake_requests').insert(payload);
      if (error) throw error;
    } else {
      console.warn('Supabase SDK unavailable, using REST fallback:', supabaseInitializationError);
      await insertViaRestFallback(payload);
    }
  } catch (error) {
    console.error('Form submission failed:', error);
    setFormStatus(contactStatus, `We could not send your message: ${formatDatabaseError(error)}`, 'error');
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
