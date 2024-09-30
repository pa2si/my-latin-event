type NavLink = {
  href: string;
  label: string;
};

export const links: NavLink[] = [
  { href: '/', label: 'home' },
  { href: '/favorites ', label: 'favorites' },
  { href: '/bookings ', label: 'bookings' },
  { href: '/reviews ', label: 'reviews' },
  { href: '/reservations ', label: 'reservations' },
  { href: '/my-events/create ', label: 'create event' },
  { href: '/my-events', label: 'my events' },
  { href: '/profile ', label: 'profile' },
  { href: '/admin ', label: 'admin' },
];
