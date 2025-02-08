'use client'

const Publications = () => {
  return (
    <section id="publications" className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white/[0.15] transition-all duration-300 mb-8">
      <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text font-playfair">Publications</h2>
      <div className="space-y-4">
        <div className="p-4 bg-white/5 rounded-lg backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
          <p className="text-gray-200 font-raleway">
            [Author List]. (Year). [Title of the Paper]. 
            <span className="italic">[Journal Name]</span>, 
            [Volume](Issue), [Pages].
          </p>
        </div>
        <div className="p-4 bg-white/5 rounded-lg backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
          <p className="text-gray-200 font-raleway">
            [Author List]. (Year). [Title of the Paper]. 
            <span className="italic">[Conference Name]</span>, 
            [Location].
          </p>
        </div>
      </div>
    </section>
  )
}

export default Publications
