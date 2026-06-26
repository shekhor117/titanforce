export function TeamBadge({ name, color, label }: { name: string; color: "primary" | "blue"; label?: string }) {
  const isPrimary = color === "primary";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`h-14 w-14 grid place-items-center rounded-md font-display font-bold text-sm ${
        isPrimary ? "bg-gradient-to-br from-primary to-[oklch(0.4_0.2_25)]" : "bg-gradient-to-br from-[oklch(0.4_0.15_240)] to-[oklch(0.3_0.1_240)]"
      }`}>{name}</div>
      <div className="text-[10px] tracking-[0.2em]">{label ?? "TFM"}</div>
    </div>
  );
}
