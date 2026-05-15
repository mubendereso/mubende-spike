import { neon } from "@neondatabase/serverless";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

export default async function TestDb() {
  const { env } = getCloudflareContext();
  const sql = neon(env.DATABASE_URL);

  let result: string;
  try {
    const rows = (await sql`select now() as ts, current_database() as db`) as Array<{
      ts: string;
      db: string;
    }>;
    result = `OK — ${rows[0].db} @ ${rows[0].ts}`;
  } catch (error) {
    result = `FAIL — ${error instanceof Error ? error.message : String(error)}`;
  }

  return (
    <main>
      <h1>DB test</h1>
      <pre>{result}</pre>
    </main>
  );
}
