// src/lib/jenworker-api.ts
// Typed client for the Jenworker backend (server.js on Railway).

const API_BASE = import.meta.env?.VITE_API_BASE ?? ""; // set in .env: VITE_API_BASE=https://jenworker-api.up.railway.app
// Next.js instead of Vite? Use: process.env.NEXT_PUBLIC_API_BASE ?? ""

export type ProspectMode = "profile" | "domain";

export interface ProspectResult {
  icp: {
    title: string;
    industries: string[];
    company_size: string;
    signals: string[];
  };
  search_plan: string[];
  sample_outreach: { subject: string; body: string };
}

export async function fetchProspect(
  prompt: string,
  mode: ProspectMode
): Promise<ProspectResult> {
  const r = await fetch(`${API_BASE}/api/prospect`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt, mode }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error ?? "Something went wrong.");
  return data.result as ProspectResult;
}

export async function submitLead(params: {
  email: string;
  source: string;
  prompt?: string;
}): Promise<void> {
  const r = await fetch(`${API_BASE}/api/leads`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error ?? "Couldn't save your email.");
}
