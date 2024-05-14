import '../../public/global.css';

export const metadata = {
  title: 'Tutoring Smart',
  description: 'An AI tutoring solution that brings you the highest quality tutoring for a fraction of the price.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
