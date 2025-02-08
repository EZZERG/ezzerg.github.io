'use client'

const Navigation = () => {
  return (
    <nav className="fixed top-4 right-4 md:right-8 z-50">
      <div className="flex gap-4 text-sm backdrop-blur-xl bg-white/10 px-6 py-3 rounded-full border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300">
        <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
        <a href="#education" className="hover:text-blue-600 transition-colors">Education</a>
        <a href="#employment" className="hover:text-blue-600 transition-colors">Employment</a>
        <a href="#publications" className="hover:text-blue-600 transition-colors">Publications</a>
      </div>
    </nav>
  )
}

export default Navigation
