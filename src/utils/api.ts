// Use relative path so Vite proxy will handle routing to backend
export const API_BASE = '';

export type RedemptionPayload = {
  id: string;
  userId: string;
  rewardId: string;
  rewardName: string;
  points: number;
  date: string;
};

export async function postRedemption(payload: RedemptionPayload) {
  const url = `${API_BASE}/api/redemptions`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server error: ${res.status} ${text}`);
  }

  return res.json();
}

export async function syncRedemptions(ids: string[]) {
  const url = `${API_BASE}/api/redemptions/batch`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error(`Sync failed: ${res.status}`);
  return res.json();
}
