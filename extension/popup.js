// Empleo Extension — Popup Controller

function extractJobFromPage() {
  const url = window.location.href;
  let title = '';
  let company = '';
  let location = '';
  let description = '';

  // 1. LinkedIn Job View
  if (url.includes('linkedin.com')) {
    title = document.querySelector('.job-details-jobs-unified-top-card__job-title')?.innerText?.trim() ||
            document.querySelector('.jobs-unified-top-card__job-title')?.innerText?.trim() ||
            document.querySelector('h1')?.innerText?.trim() || '';

    company = document.querySelector('.job-details-jobs-unified-top-card__company-name')?.innerText?.trim() ||
              document.querySelector('.jobs-unified-top-card__company-name')?.innerText?.trim() || '';

    location = document.querySelector('.job-details-jobs-unified-top-card__bullet')?.innerText?.trim() ||
               document.querySelector('.jobs-unified-top-card__bullet')?.innerText?.trim() || '';

    description = document.querySelector('.jobs-description__content')?.innerText?.trim() ||
                  document.querySelector('#job-details')?.innerText?.trim() || '';
  }
  // 2. InfoJobs
  else if (url.includes('infojobs.net')) {
    title = document.querySelector('h1')?.innerText?.trim() || '';
    company = document.querySelector('.ij-OfferHeader-company')?.innerText?.trim() || '';
    location = document.querySelector('.ij-OfferHeader-location')?.innerText?.trim() || '';
    description = document.querySelector('#pref-description')?.innerText?.trim() || '';
  }
  // 3. Indeed
  else if (url.includes('indeed.com') || url.includes('indeed.es')) {
    title = document.querySelector('.jobsearch-JobInfoHeader-title')?.innerText?.trim() ||
            document.querySelector('h1')?.innerText?.trim() || '';
    company = document.querySelector('[data-company-name="true"]')?.innerText?.trim() || '';
    location = document.querySelector('[data-testid="job-location"]')?.innerText?.trim() || '';
    description = document.querySelector('#jobDescriptionText')?.innerText?.trim() || '';
  }
  // 4. Generic / Research Careers Page (BC3, Tecnalia, universities)
  else {
    title = document.querySelector('h1')?.innerText?.trim() ||
            document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
            document.title || '';

    const ogSite = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');
    company = ogSite || window.location.hostname.replace('www.', '').split('.')[0].toUpperCase();

    description = document.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                  document.querySelector('article')?.innerText?.trim() ||
                  document.querySelector('main')?.innerText?.trim() || '';
  }

  return {
    title,
    company,
    location,
    url,
    description: description.slice(0, 2000)
  };
}

document.getElementById('btnCapture').addEventListener('click', async () => {
  const statusEl = document.getElementById('status');
  statusEl.innerText = 'Capturando datos de la pestaña...';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) {
      statusEl.innerText = 'Error: No se encontró pestaña activa.';
      return;
    }

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractJobFromPage
    });

    if (results && results[0] && results[0].result) {
      const job = results[0].result;
      document.getElementById('jobTitle').value = job.title || 'Puesto Detectado';
      document.getElementById('jobCompany').value = job.company || 'Empresa';
      document.getElementById('jobLocation').value = job.location || 'Bilbao / Remoto';
      document.getElementById('jobUrl').value = job.url || tab.url;
      document.getElementById('jobDescription').value = job.description || '';

      document.getElementById('formContainer').style.display = 'block';
      statusEl.innerText = '✅ Oferta capturada con éxito.';
    } else {
      statusEl.innerText = 'No se pudieron extraer datos automáticos.';
    }
  } catch (err) {
    statusEl.innerText = 'Error al capturar: ' + err.message;
  }
});

document.getElementById('btnCopyJson').addEventListener('click', () => {
  const data = {
    title: document.getElementById('jobTitle').value,
    company: document.getElementById('jobCompany').value,
    location: document.getElementById('jobLocation').value,
    url: document.getElementById('jobUrl').value,
    rawDescription: document.getElementById('jobDescription').value,
    status: 'Nueva',
    extractedAt: new Date().toISOString()
  };

  navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
    const statusEl = document.getElementById('status');
    statusEl.innerText = '📋 JSON copiado al portapapeles. Pégalo en Empleo.';
  });
});

document.getElementById('btnOpenApp').addEventListener('click', () => {
  const data = {
    title: document.getElementById('jobTitle').value,
    company: document.getElementById('jobCompany').value,
    location: document.getElementById('jobLocation').value,
    url: document.getElementById('jobUrl').value,
    rawDescription: document.getElementById('jobDescription').value
  };

  const encoded = encodeURIComponent(JSON.stringify(data));
  const appUrl = `https://danisantanderurrutia-coder.github.io/Empleo/?importJob=${encoded}`;
  chrome.tabs.create({ url: appUrl });
});
