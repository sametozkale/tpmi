/**
 * Approximate “active” international precious-metals dealing window (London OTC-style),
 * used only to decide when UI treats quotes as live-updating vs last-session freeze.
 *
 * - Weekdays (Europe/London): 08:00–17:30
 * - Weekends: closed
 *
 * Spot still comes from third-party APIs; this is not an exchange calendar or holiday set.
 */
export const PRECIOUS_METALS_SESSION_TIMEZONE = "Europe/London" as const;

const LONDON_WEEKDAY_TO_ISO: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

function getLondonWeekdayAndMinutes(date: Date): { weekday: number; minutesFromMidnight: number } {
  const dtf = new Intl.DateTimeFormat("en-GB", {
    timeZone: PRECIOUS_METALS_SESSION_TIMEZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = dtf.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = p.value;
  }
  const weekday = LONDON_WEEKDAY_TO_ISO[map.weekday ?? ""] ?? 7;
  const hour = Number.parseInt(map.hour ?? "0", 10);
  const minute = Number.parseInt(map.minute ?? "0", 10);
  return { weekday, minutesFromMidnight: hour * 60 + minute };
}

/** True during the configured London weekday session; false nights and weekends. */
export function isPreciousMetalsLiveSession(date: Date = new Date()): boolean {
  const { weekday, minutesFromMidnight } = getLondonWeekdayAndMinutes(date);
  if (weekday > 5) return false;
  const open = 8 * 60;
  const close = 17 * 60 + 30;
  return minutesFromMidnight >= open && minutesFromMidnight < close;
}
