import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Education from '@/components/Education'
import Experience from '@/components/Experience'
import Publications from '@/components/Publications'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Education />
        <Experience />
        <Publications />
      </main>
      <Footer />
    </>
  )
}