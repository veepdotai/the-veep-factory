//'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css'
//import './theme-shadcn.pink.css';

export const metadata = {
  title: 'Veep.AI',
  description: 'Create authentic content with Ai thanks to Veep.AI',
  robots: 'notranslate'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="notranslate">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body style={{fontFamily: "Inter,sans-serif"}}>{children}</body>
    </html>
  )
}
