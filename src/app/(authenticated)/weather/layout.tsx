import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Environment & Safety | OVERSCITE',
  description: 'Atmospheric intelligence and operational safety monitoring.',
};

export default function WeatherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
