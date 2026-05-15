import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function setCookieAction() {
  "use server";
  const jar = await cookies();
  jar.set("spike_test", `set-at-${Date.now()}`, { httpOnly: true, path: "/" });
}

async function clearCookieAction() {
  "use server";
  const jar = await cookies();
  jar.delete("spike_test");
}

export default async function TestCookie() {
  const jar = await cookies();
  const current = jar.get("spike_test")?.value ?? "(none)";

  return (
    <main>
      <h1>Cookie test</h1>
      <p>Current: <code>{current}</code></p>
      <form action={setCookieAction} style={{ display: "inline-block", marginRight: 8 }}>
        <button type="submit">Set cookie</button>
      </form>
      <form action={clearCookieAction} style={{ display: "inline-block" }}>
        <button type="submit">Clear cookie</button>
      </form>
    </main>
  );
}
