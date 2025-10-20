"use client";
import { useEffect, useState } from "react";
import { auditLogsService } from '@/services/admin/auditLogsService';
import { useTranslations } from "next-intl";


export function AuditLogsStats() {
  const t = useTranslations();
  const [stats, setStats] = useState({
    totalLogs: 0,
    totalSuccessLogs: 0,
    totalFailureLogs: 0,
    totalEntities: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    auditLogsService.getStats()
      .then((res) => {
        setStats(res);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <StatCard label={t("admin.auditLogs.stats.total")} value={stats.totalLogs} loading={loading} />
      <StatCard label={t("admin.auditLogs.stats.success")} value={stats.totalSuccessLogs} loading={loading} />
      <StatCard label={t("admin.auditLogs.stats.failure")} value={stats.totalFailureLogs} loading={loading} />
      <StatCard label={t("admin.auditLogs.stats.entities")} value={stats.totalEntities} loading={loading} />
    </div>
  );
}

function StatCard({ label, value, loading }: { label: string; value: number; loading: boolean }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex flex-col items-center justify-center">
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="text-2xl font-bold">{loading ? '...' : value}</div>
    </div>
  );
}
