import {
  Stethoscope, Fingerprint, CreditCard, FileCheck, Landmark, Search, FileText,
  Zap, Wifi, HeartPulse, GraduationCap, Car, Users, Map, Home, Check,
  BookUser, CircleDot,
} from 'lucide-react';

const MAP = {
  stethoscope: Stethoscope,
  fingerprint: Fingerprint,
  idcard: CreditCard,
  stamp: FileCheck,
  bank: Landmark,
  search: Search,
  contract: FileText,
  bolt: Zap,
  wifi: Wifi,
  heart: HeartPulse,
  school: GraduationCap,
  wheel: Car,
  car: Car,
  users: Users,
  passport: BookUser,
  map: Map,
  home: Home,
  check: Check,
};

export function Icon({ name, className, strokeWidth = 2 }) {
  const Cmp = MAP[name] || CircleDot;
  return <Cmp className={className} strokeWidth={strokeWidth} />;
}
