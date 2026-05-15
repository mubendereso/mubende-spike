const ITERATIONS = 310000;
const KEY_LENGTH_BITS = 256;

function toBase64(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

async function pbkdf2(password: string, salt: Uint8Array) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    key,
    KEY_LENGTH_BITS
  );
  return new Uint8Array(bits);
}

async function hashAction(formData: FormData) {
  "use server";
  const password = String(formData.get("password") ?? "");
  if (!password) return;

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const start = performance.now();
  const hash = await pbkdf2(password, salt);
  const elapsed = performance.now() - start;

  console.log(
    `[hash test] pbkdf2_sha256$${ITERATIONS}$${toBase64(salt)}$${toBase64(hash)} (${elapsed.toFixed(1)}ms)`
  );
}

export default function TestHash() {
  return (
    <main>
      <h1>Hash test</h1>
      <p>Submits a password, derives a PBKDF2 hash via Web Crypto, logs it.</p>
      <p>Check the Worker logs (`wrangler tail`) for the output.</p>
      <form action={hashAction}>
        <input name="password" type="password" placeholder="any password" required />
        <button type="submit" style={{ marginLeft: 8 }}>Hash</button>
      </form>
    </main>
  );
}
