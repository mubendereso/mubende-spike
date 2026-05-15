import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

async function uploadAction(formData: FormData) {
  "use server";
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return;

  const { env } = getCloudflareContext();
  const key = `spike/${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, "_")}`;

  await env.IMAGES.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type,
      cacheControl: "public, max-age=31536000, immutable"
    }
  });

  console.log(`[upload test] wrote ${key} (${file.size} bytes, ${file.type})`);
}

async function listObjects() {
  const { env } = getCloudflareContext();
  const listing = await env.IMAGES.list({ prefix: "spike/", limit: 20 });
  return listing.objects.map((obj) => ({
    key: obj.key,
    size: obj.size,
    uploaded: obj.uploaded.toISOString()
  }));
}

export default async function TestUpload() {
  const objects = await listObjects();

  return (
    <main>
      <h1>Upload test</h1>
      <form action={uploadAction} encType="multipart/form-data">
        <input type="file" name="image" accept="image/*" required />
        <button type="submit" style={{ marginLeft: 8 }}>Upload to R2</button>
      </form>
      <h2 style={{ marginTop: "2rem" }}>Recent uploads (spike/ prefix)</h2>
      {objects.length === 0 ? (
        <p>(none yet)</p>
      ) : (
        <ul>
          {objects.map((obj) => (
            <li key={obj.key}>
              <code>{obj.key}</code> — {obj.size}B — {obj.uploaded}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
