// ═══════════════════════════════════════════
// MAFIA WARS UNDERGROUND — AUTH & CLOUD SAVE
// ═══════════════════════════════════════════

// ── CONFIG (REPLACE WITH YOUR SUPABASE CREDENTIALS) ──
const SUPABASE_URL = 'https://zuvgfpldudrzwotynhwr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1dmdmcGxkdWRyendvdHluaHdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4ODE5NjcsImV4cCI6MjA4ODQ1Nzk2N30.1tDueUPrF-Uvbgn70KcF5uaIiwuyAl7CvGgrNl_VfUo';

let supabase = null;
let currentUser = null;

function initSupabase() {
  if (typeof window.supabase_lib !== 'undefined') {
    supabase = window.supabase_lib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
}

// ── AUTH UI ──
function showAuthScreen() {
  document.getElementById('splash').style.display = 'none';
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('auth-error').textContent = '';
}

function toggleAuthMode() {
  const form = document.getElementById('auth-form');
  const btn = document.getElementById('auth-submit');
  const toggle = document.getElementById('auth-toggle');
  if (btn.dataset.mode === 'login') {
    btn.dataset.mode = 'signup';
    btn.textContent = 'CREATE ACCOUNT';
    toggle.innerHTML = 'Already have an account? <a href="#" onclick="toggleAuthMode();return false">Sign In</a>';
  } else {
    btn.dataset.mode = 'login';
    btn.textContent = 'SIGN IN';
    toggle.innerHTML = 'No account? <a href="#" onclick="toggleAuthMode();return false">Create One</a>';
  }
}

async function handleAuth() {
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const errorEl = document.getElementById('auth-error');
  const btn = document.getElementById('auth-submit');
  const mode = btn.dataset.mode || 'login';

  if (!email || !password) { errorEl.textContent = 'Enter email and password.'; return; }
  if (password.length < 6) { errorEl.textContent = 'Password must be 6+ characters.'; return; }

  errorEl.textContent = '';
  btn.disabled = true;
  btn.textContent = mode === 'login' ? 'SIGNING IN...' : 'CREATING...';

  try {
    let result;
    if (mode === 'signup') {
      result = await supabase.auth.signUp({ email, password });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }

    if (result.error) {
      errorEl.textContent = result.error.message;
      btn.disabled = false;
      btn.textContent = mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT';
      return;
    }

    currentUser = result.data.user;

    // Try to load cloud save
    const cloudSave = await loadCloudSave();
    const localSave = localStorage.getItem('mw2_save');

    if (cloudSave && localSave) {
      // Both exist — ask which to use
      const cloudData = JSON.parse(cloudSave);
      const localData = JSON.parse(localSave);
      const cloudLevel = cloudData.level || 1;
      const localLevel = localData.level || 1;
      showSaveConflict(cloudLevel, localLevel, cloudSave, localSave);
      return;
    } else if (cloudSave) {
      // Only cloud — use it
      localStorage.setItem('mw2_save', cloudSave);
    } else if (localSave) {
      // Only local — push to cloud
      await saveToCloud(localSave);
    }
    // else: no save anywhere — new game

    document.getElementById('auth-screen').style.display = 'none';
    showCharScreen();

  } catch (e) {
    errorEl.textContent = 'Connection error. Try again.';
    console.error('Auth error:', e);
  }

  btn.disabled = false;
  btn.textContent = mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT';
}

function showSaveConflict(cloudLevel, localLevel, cloudSave, localSave) {
  document.getElementById('auth-screen').style.display = 'none';
  const el = document.getElementById('save-conflict');
  el.style.display = 'flex';
  document.getElementById('cloud-level').textContent = cloudLevel;
  document.getElementById('local-level').textContent = localLevel;
  el.dataset.cloudSave = cloudSave;
  el.dataset.localSave = localSave;
}

async function resolveSaveConflict(choice) {
  const el = document.getElementById('save-conflict');
  if (choice === 'cloud') {
    localStorage.setItem('mw2_save', el.dataset.cloudSave);
  } else {
    localStorage.setItem('mw2_save', el.dataset.localSave);
    await saveToCloud(el.dataset.localSave);
  }
  el.style.display = 'none';
  showCharScreen();
}

async function handleGuestPlay() {
  currentUser = null;
  document.getElementById('auth-screen').style.display = 'none';
  showCharScreen();
}

async function handleSignOut() {
  if (supabase && currentUser) {
    // Save to cloud before signing out
    const localSave = localStorage.getItem('mw2_save');
    if (localSave) await saveToCloud(localSave);
    await supabase.auth.signOut();
  }
  currentUser = null;
  toast('Signed out.', 'r');
}

// ── CLOUD SAVE/LOAD ──
async function loadCloudSave() {
  if (!supabase || !currentUser) return null;
  try {
    const { data, error } = await supabase
      .from('game_saves')
      .select('save_data')
      .eq('user_id', currentUser.id)
      .single();
    if (error || !data) return null;
    return data.save_data;
  } catch (e) {
    console.error('Cloud load error:', e);
    return null;
  }
}

async function saveToCloud(saveData) {
  if (!supabase || !currentUser) return;
  try {
    const parsed = JSON.parse(saveData);
    await supabase
      .from('game_saves')
      .upsert({
        user_id: currentUser.id,
        save_data: saveData,
        level: parsed.level || 1,
        name: parsed.name || 'Unknown',
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
  } catch (e) {
    console.error('Cloud save error:', e);
  }
}

// ── AUTO CLOUD SYNC (every 60s) ──
function startCloudSync() {
  setInterval(async () => {
    if (!currentUser) return;
    const localSave = localStorage.getItem('mw2_save');
    if (localSave) await saveToCloud(localSave);
  }, 60000);
}

// ── OVERRIDE save() to also cloud save periodically ──
const _originalSave = typeof save === 'function' ? save : null;
let _cloudSaveTimer = null;
function cloudSaveHook() {
  // Debounce cloud saves to every 30s max
  if (_cloudSaveTimer) return;
  _cloudSaveTimer = setTimeout(async () => {
    if (currentUser) {
      const localSave = localStorage.getItem('mw2_save');
      if (localSave) await saveToCloud(localSave);
    }
    _cloudSaveTimer = null;
  }, 30000);
}
