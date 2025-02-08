'use client'

import paper1 from '@/data/papers/paper1.json'
import paper2 from '@/data/papers/paper2.json'

const publicationsData = [paper1, paper2]

const Publications = () => {
  return (
    <section id="publications" className="space-y-6">
      <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text font-playfair">
        Publications
      </h2>
      
      <div className="grid grid-cols-1 gap-6">
        {publicationsData.map((pub, index) => (
          <div
            key={index}
            className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20 shadow-xl 
                       hover:bg-white/[0.15] transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-blue-300 font-raleway">
                  {pub.title}
                </h3>
                
                <p className="text-gray-300 mt-2 font-medium">
                  {pub.year} | {pub.venue}
                </p>
                
                <p className="text-gray-200 mt-2 font-raleway">
                  {pub.authors.join(", ")}
                </p>
                
                <p className="text-gray-200 mt-4 leading-relaxed">
                  {pub.abstract}
                </p>
                
                <div className="flex gap-4 mt-4">
                  {pub.links.arxiv && (
                    <a href={pub.links.arxiv} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-400 hover:text-blue-300 transition-colors">
                      arXiv
                    </a>
                  )}
                  {pub.links.code && (
                    <a href={pub.links.code} target="_blank" rel="noopener noreferrer"
                       className="text-blue-400 hover:text-blue-300 transition-colors">
                      Code
                    </a>
                  )}
                  {pub.links.pdf && (
                    <a href={pub.links.pdf} target="_blank" rel="noopener noreferrer"
                       className="text-blue-400 hover:text-blue-300 transition-colors">
                      PDF
                    </a>
                  )}
                </div>
              </div>
              
              <div className="lg:w-1/3 rounded-lg overflow-hidden bg-white/10">
                <img
                  src={pub.previewImage}
                  alt={`Preview of ${pub.title}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Publications
