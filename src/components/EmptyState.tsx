import { PackageOpen } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="surface-card p-10 text-center">
      <PackageOpen className="h-10 w-10 mx-auto text-muted-token mb-3" />
      <p className="font-medium">{title}</p>
      {description && <p className="text-sm text-secondary-token mt-1">{description}</p>}
    </div>
  );
}
