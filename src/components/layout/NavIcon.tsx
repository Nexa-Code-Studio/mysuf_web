import {
  Activity,
  AlertTriangle,
  Ban,
  BarChart3,
  Fuel,
  Gauge,
  History,
  IdCard,
  LayoutGrid,
  MapPinned,
  Radar,
  ShieldAlert,
  SlidersHorizontal,
  Truck,
  UserCheck,
  Users,
  FileText,
  Command,
  Settings,
  UserCircle2,
  Bell,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  layout: LayoutGrid,
  chart: BarChart3,
  alert: ShieldAlert,
  users: Users,
  fuel: Fuel,
  radar: Radar,
  history: History,
  id: IdCard,
  sliders: SlidersHorizontal,
  heat: MapPinned,
  ban: Ban,
  shield: AlertTriangle,
  command: Command,
  activity: Activity,
  truck: Truck,
  gauge: Gauge,
  file: FileText,
  eligibility: UserCheck,
  settings: Settings,
  user: UserCircle2,
  bell: Bell,
};

export default function NavIcon({ name, className = "" }: { name: string; className?: string }) {
  const Icon = iconMap[name] ?? LayoutGrid;
  return <Icon className={className} aria-hidden />;
}
