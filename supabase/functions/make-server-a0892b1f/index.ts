import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();
app.use("*", logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

// --- KV helpers (inline) ---
const kvClient = () => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);
const kvSet = async (key: string, value: any) => {
  const { error } = await kvClient().from("kv_store_a0892b1f").upsert({ key, value });
  if (error) throw new Error(error.message);
};
const kvGet = async (key: string) => {
  const { data, error } = await kvClient().from("kv_store_a0892b1f").select("value").eq("key", key).maybeSingle();
  if (error) throw new Error(error.message);
  return data?.value;
};
const kvDel = async (key: string) => {
  const { error } = await kvClient().from("kv_store_a0892b1f").delete().eq("key", key);
  if (error) throw new Error(error.message);
};

// --- Phone formatting ---
function formatPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-]/g, "");
  if (cleaned.startsWith("+234")) return cleaned.slice(1);
  if (cleaned.startsWith("234")) return cleaned;
  if (cleaned.startsWith("0")) return "234" + cleaned.slice(1);
  return "234" + cleaned;
}

app.get("/make-server-a0892b1f/health", (c) => c.json({ status: "ok" }));

// POST /make-server-a0892b1f/otp/send
app.post("/make-server-a0892b1f/otp/send", async (c) => {
  try {
    const { phone } = await c.req.json();
    if (!phone) return c.json({ error: "Phone number is required" }, 400);

    const apiKey = Deno.env.get("TERMII_API_KEY");
    if (!apiKey) return c.json({ error: "SMS service not configured" }, 500);

    const formatted = formatPhone(phone);

    const resp = await fetch("https://api.ng.termii.com/api/sms/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        message_type: "NUMERIC",
        to: formatted,
        from: "FastWaybil",
        channel: "generic",
        pin_attempts: 3,
        pin_time_to_live: 10,
        pin_length: 6,
        pin_placeholder: "< 1234 >",
        message_text: "Your FastWaybill code is < 1234 >. Valid 10 mins. Never share it.",
        pin_type: "NUMERIC",
      }),
    });

    const data = await resp.json();
    if (!data.pinId) {
      console.error("Termii error:", JSON.stringify(data));
      return c.json({ error: data.message || "Failed to send OTP. Try again." }, 400);
    }

    await kvSet(`otp:${formatted}`, {
      pinId: data.pinId,
      expires: Date.now() + 10 * 60 * 1000,
    });

    return c.json({ success: true });
  } catch (err) {
    console.error("otp/send error:", err);
    return c.json({ error: "Internal error. Please try again." }, 500);
  }
});

// POST /make-server-a0892b1f/otp/verify
app.post("/make-server-a0892b1f/otp/verify", async (c) => {
  try {
    const { phone, otp } = await c.req.json();
    if (!phone || !otp) return c.json({ error: "Phone and OTP required" }, 400);

    const apiKey = Deno.env.get("TERMII_API_KEY");
    if (!apiKey) return c.json({ error: "SMS service not configured" }, 500);

    const formatted = formatPhone(phone);

    const stored = await kvGet(`otp:${formatted}`);
    if (!stored) return c.json({ error: "No OTP found. Please request a new one." }, 400);
    if (Date.now() > stored.expires) {
      await kvDel(`otp:${formatted}`);
      return c.json({ error: "OTP expired. Please request a new one." }, 400);
    }

    const resp = await fetch("https://api.ng.termii.com/api/sms/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, pin_id: stored.pinId, pin: otp }),
    });

    const data = await resp.json();
    const isVerified = data.verified === "True" || data.verified === true || data.verified === "true";
    if (!isVerified) {
      console.error("Termii verify:", JSON.stringify(data));
      return c.json({ error: "Wrong OTP. Please try again." }, 400);
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const phoneEmail = `${formatted}@fastwaybill.phone`;

    const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
      email: phoneEmail,
      email_confirm: true,
      user_metadata: { phone: `+${formatted}`, phone_verified: true, full_name: `+${formatted}` },
    });

    if (createErr) {
      const { data: list } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
      const existing = list?.users.find((u: any) => u.email === phoneEmail);
      if (!existing) return c.json({ error: "Account setup failed. Contact support." }, 500);
    }

    const { data: linkData, error: linkErr } = await adminClient.auth.admin.generateLink({
      type: "magiclink",
      email: phoneEmail,
    });

    if (linkErr) return c.json({ error: linkErr.message }, 500);

    await kvDel(`otp:${formatted}`);

    return c.json({
      success: true,
      hashed_token: linkData.properties.hashed_token,
      email: phoneEmail,
    });
  } catch (err) {
    console.error("otp/verify error:", err);
    return c.json({ error: "Internal error. Please try again." }, 500);
  }
});

Deno.serve(app.fetch);
