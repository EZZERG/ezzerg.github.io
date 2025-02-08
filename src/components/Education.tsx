'use client'

const educationData = [
  {
    institution: "Current University Name",
    degree: "PhD in [Your Field]",
    years: "2021 - Present",
    description: "Currently researching [Topic] under the supervision of [Professor]. Focus areas include [Area 1], [Area 2], and [Area 3]. Part of the [Lab/Research Group] working on [Project/Initiative].",
    logo: "/institutions/current-university.svg"
  },
  {
    institution: "Previous University Name",
    degree: "Master's in [Your Field]",
    years: "2019 - 2021",
    description: "Completed thesis on [Topic] with focus on [Specific Area]. Participated in [Notable Project/Research].",
    logo: "/institutions/masters-university.svg"
  },
  {
    institution: "First University Name",
    degree: "Bachelor's in [Your Field]",
    years: "2015 - 2019",
    description: "Graduated with honors. Major in [Subject] with minor in [Subject]. Key projects included [Project 1] and [Project 2].",
    logo: "/institutions/bachelors-university.svg"
  }
]

const Education = () => {
  return (
    <section id="education" className="space-y-6">
      <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text font-playfair">
        Education
      </h2>
      
      <div className="grid grid-cols-1 gap-6">
        {educationData.map((edu, index) => (
          <div
            key={index}
            className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20 shadow-xl 
                       hover:bg-white/[0.15] transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-white/10 p-4 flex-shrink-0">
                <img
                  src={edu.logo}
                  alt={`${edu.institution} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-blue-300 font-raleway">
                  {edu.institution}
                </h3>
                <p className="text-xl text-gray-200 mt-1 font-raleway">
                  {edu.degree}
                </p>
                <p className="text-gray-300 mt-1 font-medium">
                  {edu.years}
                </p>
                <p className="text-gray-200 mt-4 leading-relaxed">
                  {edu.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Education
