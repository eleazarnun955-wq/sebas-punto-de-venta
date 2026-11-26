import { Capacitor } from "@capacitor/core";
import { CapacitorNeon } from "@capgo/capacitor-neon";

// URLs públicas de la rama de pruebas. No contienen credenciales.
// Nunca sustituirlas por una URL de producción sin probar migraciones y RLS.
const CONFIG = Object.freeze({
  authUrl: "https://ep-hidden-queen-bd9932e4.neonauth.c-8.us-east-2.aws.neon.tech/neondb/auth",
  dataApiUrl: "https://ep-hidden-queen-bd9932e4.apirest.c-8.us-east-2.aws.neon.tech/neondb/rest/v1"
});

let ready = null;
let listener = null;
let currentSession = null;
const subscribers = new Set();

function publish(session) {
  currentSession = session ?? null;
  for (const callback of subscribers) callback(currentSession);
}

export function nativeAuthAvailable() {
  return Capacitor.isNativePlatform();
}

export async function initNeonAuth(onChange) {
  if (typeof onChange === "function") subscribers.add(onChange);
  if (!nativeAuthAvailable()) {
    return { available: false, session: null };
  }
  if (!listener) {
    listener = await CapacitorNeon.addListener("authStateChange", ({ session }) => publish(session));
  }
  if (!ready) {
    ready = CapacitorNeon.initialize(CONFIG)
      .then(async () => {
        const result = await CapacitorNeon.getSession();
        publish(result.session);
      })
      .catch(error => {
        ready = null;
        throw error;
      });
  }
  await ready;
  return { available: true, session: currentSession };
}

async function ensureReady() {
  await initNeonAuth();
  if (!nativeAuthAvailable()) throw new Error("El acceso con cuenta está disponible en la aplicación Android.");
}

export async function signInWithEmail(email, password) {
  await ensureReady();
  const result = await CapacitorNeon.signInWithPassword({ email: email.trim(), password });
  publish(result.session);
  return result;
}

export async function signUpWithEmail(email, password, name) {
  await ensureReady();
  const result = await CapacitorNeon.signUp({ email: email.trim(), password, name: name.trim() || email.split("@")[0] });
  publish(result.session);
  return result;
}

export async function signOutNeon() {
  await ensureReady();
  await CapacitorNeon.signOut();
  publish(null);
}

export function getCurrentNeonSession() {
  return currentSession;
}
