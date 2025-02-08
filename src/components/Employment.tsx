'use client'

const employmentData = [
  {
    employer: "Current University Name",
    title: "Research Assistant",
    years: "2022 - Present",
    description: "[Brief description of your role and responsibilities, including key projects, achievements, and areas of focus. Consider mentioning specific research areas, publications, or collaborations.]",
    logo: "/institutions/current-employer.svg"
  },
  {
    employer: "Previous University Name",
    title: "Teaching Assistant",
    years: "2020 - 2022",
    description: "[Brief description of courses and responsibilities, including subjects taught, student mentoring, and any curriculum development work. Highlight key achievements and impact on student learning.]",
    logo: "/institutions/previous-employer.svg"
  }
]

const Employment = () => {
  return (
    <section id="employment" className="space-y-6">
      <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text font-playfair">
        Employment
      </h2>
      
      <div className="grid grid-cols-1 gap-6">
        {employmentData.map((job, index) => (
          <div
            key={index}
            className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20 shadow-xl 
                       hover:bg-white/[0.15] transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-white/10 p-4 flex-shrink-0">
                <img
                  src={job.logo}
                  alt={`${job.employer} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-blue-300 font-raleway">
                  {job.employer}
                </h3>
                <p className="text-xl text-gray-200 mt-1 font-raleway">
                  {job.title}
                </p>
                <p className="text-gray-300 mt-1 font-medium">
                  {job.years}
                </p>
                <p className="text-gray-200 mt-4 leading-relaxed">
                  {job.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Employment
