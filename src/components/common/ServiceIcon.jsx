import { MapPinned, PartyPopper, Plane, Route, Users } from 'lucide-react';

const icons = { Plane, Route, Users, MapPinned, PartyPopper };

export default function ServiceIcon({ name, className = 'h-6 w-6' }) {
  const Icon = icons[name] ?? Route;
  return <Icon className={className} />;
}