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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ezzerg.github.io',
    title: 'Abdelhamid Ezzerg - PhD Student in Statistics and Machine Learning - Applied Scientist',
    description: 'Personal website of Abdelhamid Ezzerg, PhD student in Statistics and Machine Learning - Applied Scientist.',
    siteName: 'Abdelhamid Ezzerg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abdelhamid Ezzerg - PhD Student in Statistics and Machine Learning - Applied Scientist',
    description: 'Personal website of Abdelhamid Ezzerg, PhD student in Statistics and Machine Learning - Applied Scientist.',
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