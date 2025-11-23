import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { postRedemption, syncRedemptions } from "../utils/api";

interface RedemptionRecord {
  id: string;
  userId: string;
  rewardId: string;
  rewardName: string;
  points: number;
  date: string;
  status: "pending" | "completed" | string;
  completedAt?: string;
}

export default function RedemptionsView() {
  const [items, setItems] = useState<RedemptionRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const load = () => {
    try {
      const raw = localStorage.getItem("ecobank_redemptions");
      const arr: RedemptionRecord[] = raw ? JSON.parse(raw) : [];
      // show newest first
      setItems(arr.slice().reverse());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const simulateSyncAll = async () => {
    setLoading(true);
    try {
      const raw = localStorage.getItem("ecobank_redemptions");
      const arr: RedemptionRecord[] = raw ? JSON.parse(raw) : [];
      const pending = arr.filter((r) => r.status === "pending");
      if (pending.length === 0) {
        toast.info("Tidak ada penukaran pending yang perlu disinkronkan");
        setLoading(false);
        return;
      }

      // Try batch sync via API
      try {
        const ids = pending.map((p) => p.id);
        const resp = await syncRedemptions(ids);
        // resp should indicate processed ids
        const processed: string[] = resp.processed || ids;
        const updated = arr.map((r) => {
          if (processed.includes(r.id)) {
            return { ...r, status: "completed", completedAt: new Date().toISOString() };
          }
          return r;
        });
        localStorage.setItem("ecobank_redemptions", JSON.stringify(updated));
        toast.success("Sinkronisasi selesai. Penukaran pending telah diproses oleh server.");
        load();
      } catch (err) {
        // Fallback: try one-by-one posting
        for (const p of pending) {
          try {
            await postRedemption({ id: p.id, userId: p.userId, rewardId: p.rewardId, rewardName: p.rewardName, points: p.points, date: p.date });
            const idx = arr.findIndex((x) => x.id === p.id);
            if (idx !== -1) {
              arr[idx].status = "completed";
              arr[idx].completedAt = new Date().toISOString();
            }
          } catch (e) {
            console.error("Item sync failed", p.id, e);
          }
        }
        localStorage.setItem("ecobank_redemptions", JSON.stringify(arr));
        toast.success("Sinkronisasi selesai (fallback). Cek riwayat untuk status.");
        load();
      }
    } catch (e) {
      console.error(e);
      toast.error("Gagal menyinkronkan penukaran.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-end mb-2 gap-2">
        <Button variant="outline" onClick={load}>Muat Ulang</Button>
        <Button onClick={simulateSyncAll} disabled={loading}>
          {loading ? "Menyinkronkan..." : "Sinkronkan Pending"}
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="p-4 text-center">Belum ada penukaran.</Card>
      ) : (
        <div className="space-y-2">
          {items.map((it) => (
            <Card key={it.id} className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{it.rewardName}</div>
                  <div className="text-xs text-gray-500">{new Date(it.date).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{it.points.toLocaleString()} pts</div>
                  <div className="mt-1">
                    {it.status === "pending" ? (
                      <Badge variant="destructive">Pending</Badge>
                    ) : (
                      <Badge variant="outline">Selesai</Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
