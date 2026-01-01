import './globals.css';

export const metadata = {
  title: 'AgroMart',
  description: 'AgroMart - Connect with Farmers',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
