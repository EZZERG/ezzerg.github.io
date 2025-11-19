import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import AnimatedBackground from '@/components/AnimatedBackground'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Abdelhamid Ezzerg',
  description: 'Personal website of Abdelhamid Ezzerg, PhD student in Statistics and Machine Learning - Applied Scientist.',
  keywords: ['Abdelhamid Ezzerg', 'AI researcher', 'machine learning', 'computer vision', 'NLP', 'artificial intelligence', 'Bayesian Statistics', 'Bayesian Machine Learning'],
  authors: [{ name: 'Abdelhamid Ezzerg' }],
  creator: 'Abdelhamid Ezzerg',
  robots: 'index, follow',
  metadataBase: new URL('https://ezzerg.github.io'),
  alternates: {
    canonical: 'https://ezzerg.github.io/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ezzerg.github.io',
    title: 'Abdelhamid Ezzerg - PhD Student in Statistics and Machine Learning - Applied Scientist',
    description: 'Personal website of Abdelhamid Ezzerg, PhD student in Statistics and Machine Learning - Applied Scientist.',
    siteName: 'Abdelhamid Ezzerg',
    images: [
      {
        url: '/profile_photo/Profile_photo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Abdelhamid Ezzerg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abdelhamid Ezzerg - PhD Student in Statistics and Machine Learning - Applied Scientist',
    description: 'Personal website of Abdelhamid Ezzerg, PhD student in Statistics and Machine Learning - Applied Scientist.',
    images: ['/profile_photo/Profile_photo.jpeg'],
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Abdelhamid Ezzerg',
              url: 'https://ezzerg.github.io',
              image: 'https://ezzerg.github.io/profile_photo/Profile_photo.jpeg',
              jobTitle: 'PhD Student in Statistics and Machine Learning',
              description:
                'Personal website of Abdelhamid Ezzerg, PhD student in Statistics and Machine Learning - Applied Scientist.',
              sameAs: [
                // Add social profiles here if available, e.g.:
                // 'https://twitter.com/yourhandle',
                'https://www.linkedin.com/in/abdelhamid-ezzerg-274437a6/'
              ],
            }),
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AnimatedBackground />
          <div className="relative z-10">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}