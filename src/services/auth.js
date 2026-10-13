const ACCOUNTS_KEY = 'cv_accounts';
const SESSION_KEY = 'cv_session';

function readAccounts() {
  try {
    const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '{}');
    return accounts && typeof accounts === 'object' ? accounts : {};
  } catch {
    return {};
  }
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function toHex(bytes) {
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure password storage is unavailable in this browser. Open CineVault on localhost or HTTPS.');
  }
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 120000, hash: 'SHA-256' },
    key,
    256,
  );
  return toHex(bits);
}

export function getCurrentUser() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    return session?.email && session?.name ? session : null;
  } catch {
    return null;
  }
}

export async function signUp({ name, email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const accounts = readAccounts();
  if (accounts[normalizedEmail]) throw new Error('An account with this email already exists. Sign in instead.');

  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
  const account = { name: name.trim(), email: normalizedEmail, salt, passwordHash: await hashPassword(password, salt) };
  accounts[normalizedEmail] = account;
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));

  const user = { name: account.name, email: account.email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export async function signIn({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const account = readAccounts()[normalizedEmail];
  if (!account) throw new Error('No account found for this email. Create an account to continue.');

  const passwordHash = await hashPassword(password, account.salt);
  if (passwordHash !== account.passwordHash) throw new Error('That password does not match this account.');

  const user = { name: account.name, email: account.email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
}
