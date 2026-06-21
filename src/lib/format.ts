/**
 * Format a number representing money (IDR) to a shorter string using jt, M, etc.
 * Example:
 * 1500000 -> "Rp 1,5 jt"
 * 20000000 -> "Rp 20 jt"
 * 1000000000 -> "Rp 1 M"
 */
export function formatShortMoney(value: number): string {
  if (value === 0) return "Rp 0";
  let suffix = "";
  let divisor = 1;
  
  if (value >= 1e12) {
    suffix = " T";
    divisor = 1e12;
  } else if (value >= 1e9) {
    suffix = " M";
    divisor = 1e9;
  } else if (value >= 1e6) {
    suffix = " jt";
    divisor = 1e6;
  } else if (value >= 1e3) {
    suffix = " rb";
    divisor = 1e3;
  }

  const formatted = (value / divisor).toLocaleString("id-ID", {
    maximumFractionDigits: 2,
  });
  return `Rp ${formatted}${suffix}`;
}

/**
 * Standard IDR currency formatter
 */
export function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Safely parse a datetime string from backend (which is in UTC but might lack timezone suffix 'Z').
 */
export function parseBackendDate(dateStr: string | null | undefined): Date {
  if (!dateStr) return new Date();
  const formattedStr = dateStr.endsWith("Z") || dateStr.includes("+") ? dateStr : `${dateStr}Z`;
  return new Date(formattedStr);
}

