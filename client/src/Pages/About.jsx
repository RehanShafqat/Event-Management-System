import { Button } from "@/components/ui/button";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0e0e0e]">
      <main className="flex-1">
        <section className="relative h-[400px] w-full bg-[#1a1a1a] flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              About Softec Management
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Empowering businesses with innovative solutions since 2015
            </p>
            <Button className="bg-[#7f3fbf] hover:bg-[#9d5bdf] text-white px-8 py-6 text-lg">
              Learn More
            </Button>
          </div>
        </section>

        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <p className="text-gray-400 mb-4">
                Founded in 2015, Softec Management began with a simple mission:
                to create powerful yet intuitive management tools that help
                businesses thrive in the digital age.
              </p>
              <p className="text-gray-400 mb-4">
                What started as a small team of passionate developers has grown
                into a company serving thousands of clients worldwide, all while
                maintaining our commitment to quality and innovation.
              </p>
              <p className="text-gray-400">
                Today, we continue to push boundaries, developing solutions that
                streamline workflows and empower teams to achieve more.
              </p>
            </div>
            <div className="bg-[#2a2a2a] rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1470&auto=format&fit=crop"
                alt="Our team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* <section className="py-16 px-4 bg-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Meet Our Leadership
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex Johnson",
                  role: "CEO & Founder",
                  bio: "Visionary leader with 15+ years in software development",
                  img: "https://randomuser.me/api/portraits/men/32.jpg",
                },
                {
                  name: "Sarah Williams",
                  role: "CTO",
                  bio: "Tech innovator specializing in scalable architectures",
                  img: "https://randomuser.me/api/portraits/women/44.jpg",
                },
                {
                  name: "Michael Chen",
                  role: "Head of Product",
                  bio: "Product strategist focused on user experience",
                  img: "https://randomuser.me/api/portraits/men/75.jpg",
                },
              ].map((member, index) => (
                <div
                  key={index}
                  className="bg-[#2a2a2a] rounded-lg overflow-hidden"
                >
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white">
                      {member.name}
                    </h3>
                    <p className="text-[#7f3fbf] mb-2">{member.role}</p>
                    <p className="text-gray-400">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}
      </main>

      <footer className="bg-[#1a1a1a] border-t border-[#2a2a2a] py-8 px-4"></footer>
    </div>
  );
};

export default AboutPage;
