import { NextResponse } from "next/server";
import { type Address } from "viem";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const AVATARS_BUCKET = "avatars";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function isAddress(value: string): value is Address {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

function supabaseHeaders() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  };
}

async function supabaseFetch(path: string, init?: RequestInit) {
  if (!SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  }

  return fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      ...supabaseHeaders(),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
}

export async function GET(request: Request) {
  try {
    const address = new URL(request.url).searchParams.get("address")?.trim();

    if (!address || !isAddress(address)) {
      return jsonError("Invalid wallet address.");
    }

    const res = await supabaseFetch(
      `/rest/v1/profiles?wallet_address=eq.${address.toLowerCase()}&select=wallet_address,username,avatar_url,badge&limit=1`,
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error("Supabase profile GET failed:", detail);
      return jsonError("Could not load profile metadata.", 502);
    }

    const rows = await res.json();
    return NextResponse.json({ profile: rows[0] ?? null });
  } catch (error: any) {
    console.error("Profile GET error:", error);
    return jsonError(error?.message || "Could not load profile metadata.", 500);
  }
}

export async function POST(request: Request) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return jsonError("Supabase server environment variables are missing.", 500);
    }

    const form = await request.formData();
    const wallet = String(form.get("wallet") || "").trim();
    const message = String(form.get("message") || "");
    const signature = String(form.get("signature") || "");
    const username = String(form.get("username") || "").trim();
    const badge = Number(form.get("badge") || 0);
    const avatar = form.get("avatar");

    if (!isAddress(wallet)) {
      return jsonError("Invalid wallet address.");
    }

    // Profile metadata is intentionally not gated by a wallet signature.
    // The wallet address is still validated before any profile data is saved.
    // The frontend may continue sending message/signature fields; they are
    // ignored by this endpoint.

    let avatarUrl: string | null = null;

    if (avatar instanceof File && avatar.size > 0) {
      if (!avatar.type.startsWith("image/")) {
        return jsonError("Avatar must be an image.");
      }

      if (avatar.size > 5 * 1024 * 1024) {
        return jsonError("Avatar must be 5 MB or smaller.");
      }

      const allowedExt = new Map([
        ["image/jpeg", "jpg"],
        ["image/png", "png"],
        ["image/webp", "webp"],
        ["image/gif", "gif"],
      ]);

      const extension = allowedExt.get(avatar.type);

      if (!extension) {
        return jsonError(
          "Only JPG, PNG, WEBP and GIF avatars are supported.",
        );
      }

      const path = `${wallet.toLowerCase()}/${crypto.randomUUID()}.${extension}`;
      const bytes = new Uint8Array(await avatar.arrayBuffer());

      const uploadRes = await supabaseFetch(
        `/storage/v1/object/${AVATARS_BUCKET}/${path}`,
        {
          method: "POST",
          headers: {
            "Content-Type": avatar.type,
            "x-upsert": "true",
          },
          body: bytes,
        },
      );

      if (!uploadRes.ok) {
        const detail = await uploadRes.text();
        console.error("Supabase avatar upload failed:", detail);
        return jsonError("Avatar upload failed.", 502);
      }

      avatarUrl = `${SUPABASE_URL}/storage/v1/object/public/${AVATARS_BUCKET}/${path}`;
    }

    const row: Record<string, unknown> = {
      wallet_address: wallet.toLowerCase(),
      username: username || null,
      badge,
      updated_at: new Date().toISOString(),
    };

    if (avatarUrl) {
      row.avatar_url = avatarUrl;
    }

    const upsertRes = await supabaseFetch(
      "/rest/v1/profiles?on_conflict=wallet_address",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=representation",
        },
        body: JSON.stringify([row]),
      },
    );

    if (!upsertRes.ok) {
      const detail = await upsertRes.text();
      console.error("Supabase profile upsert failed:", detail);
      return jsonError("Could not save profile.", 502);
    }

    const rows = await upsertRes.json();
    return NextResponse.json({ profile: rows[0] ?? row });
  } catch (error: any) {
    console.error("Profile POST error:", error);
    return jsonError(error?.message || "Could not save profile.", 500);
  }
}
