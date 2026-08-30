import { cn } from "@/lib/utils";

export const GRID_BORDER = "#D4D4D4";

export interface StatItem {
  label: string;
  value: string;
  caption?: string;
  captionClassName?: string;
}

function StatDivider({ index }: { index: number }) {
  if (index === 0) return null;

  return (
    <span
      aria-hidden
      className={cn(
        "absolute left-0 top-1/2 hidden h-[70px] w-px -translate-y-1/2",
        index % 2 !== 0 && "max-md:block",
        index % 4 !== 0 && "md:block"
      )}
      style={{ backgroundColor: GRID_BORDER }}
    />
  );
}

export function StatGrid({
  stats,
  flushTop = false,
}: {
  stats: StatItem[];
  flushTop?: boolean;
}) {
  return (
    <div
      className={cn(
        "-mx-6 border-b bg-white lg:-mx-8",
        flushTop && "-mt-6 lg:-mt-8"
      )}
      style={{ borderColor: GRID_BORDER }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="relative flex min-h-[6.75rem] flex-col items-center justify-center gap-[0.45rem] px-6 py-[1.8rem] text-center"
          >
            <StatDivider index={index} />
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-600">
              {stat.label}
            </p>
            <p className="tabular-nums text-[28px] font-semibold leading-none text-gray-900">
              {stat.value}
            </p>
            {stat.caption && (
              <p
                className={cn(
                  "text-[11px] text-gray-600",
                  stat.captionClassName
                )}
              >
                {stat.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
