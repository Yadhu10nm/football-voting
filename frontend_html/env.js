window.__ENV = { API_BASE: 'http://127.0.0.1:8000' };

async function loadEnv() {
  try {
    const response = await fetch('.env');
    if (!response.ok) {
      console.warn('Unable to load .env file, using default backend URL.');
      return;
    }

    const text = await response.text();
    const lines = text.split(/\r?\n/).filter((line) => line && !line.startsWith('#'));

    for (const line of lines) {
      const [key, ...rest] = line.split('=');
      if (!key) continue;
      window.__ENV[key.trim()] = rest.join('=').trim();
    }
  } catch (error) {
    console.warn('Error reading .env file:', error);
  }
}

window.__envReady = loadEnv();
