import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Mubende CF Spike</h1>
      <p>Each test exercises one risky pattern from the real admin.</p>
      <ul style={{ lineHeight: 2 }}>
        <li><Link href="/test-db">DB</Link> — Neon over HTTP from a Worker</li>
        <li><Link href="/test-cookie">Cookies</Link> — set + read via next/headers</li>
        <li><Link href="/test-hash">Hash</Link> — Web Crypto PBKDF2 password hash</li>
        <li><Link href="/test-upload">Upload</Link> — Server Action writing to R2 binding</li>
      </ul>
      <p>If all four work in `wrangler deploy`, the real admin can port cleanly.</p>
    </main>
  );
}
