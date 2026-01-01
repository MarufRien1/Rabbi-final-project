import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'AgroMart',
  description: 'AgroMart - Connect with Farmers',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}
