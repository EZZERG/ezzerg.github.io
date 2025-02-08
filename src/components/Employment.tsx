'use client'

const Employment = () => {
  return (
    <section id="employment" className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/20 shadow-xl hover:bg-white/[0.15] transition-all duration-300">
      <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text font-playfair">Employment</h2>
      <div className="space-y-4">
        <div className="border-l-2 border-green-500 pl-4">
          <h3 className="text-xl font-semibold text-blue-300 font-raleway">Research Assistant</h3>
          <p className="text-gray-300">Department • University Name</p>
          <p className="text-gray-200 mt-2">[Brief description of your role and responsibilities]</p>
        </div>
        <div className="border-l-2 border-green-500 pl-4">
          <h3 className="text-xl font-semibold text-blue-300 font-raleway">Teaching Assistant</h3>
          <p className="text-gray-300">Department • University Name</p>
          <p className="text-gray-200 mt-2">[Brief description of courses and responsibilities]</p>
        </div>
      </div>
    </section>
  )
}

export default Employment
