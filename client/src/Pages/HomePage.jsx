import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Aperture, Github, Home, Info, Mail, Phone, User } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const carouselImages = [
    "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=1469&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0e0e0e]">
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Carousel */}
        <section className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {carouselImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[500px] w-full">
                    <img
                      src={image}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-center px-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                          Welcome to Softec Management
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                          Streamline your workflow with our powerful management
                          system
                        </p>
                        <Button className="bg-[#7f3fbf] hover:bg-[#9d5bdf] text-white px-8 py-6 text-lg">
                          Get Started
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#2a2a2a] border-[#7f3fbf] text-white hover:bg-[#7f3fbf]" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#2a2a2a] border-[#7f3fbf] text-white hover:bg-[#7f3fbf]" />
          </Carousel>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Powerful Dashboard",
                description:
                  "Get insights and analytics at a glance with our intuitive dashboard.",
                icon: <Aperture className="h-8 w-8 text-[#7f3fbf]" />,
              },
              {
                title: "Secure Access",
                description:
                  "Enterprise-grade security to protect your data and privacy.",
                icon: <Aperture className="h-8 w-8 text-[#7f3fbf]" />,
              },
              {
                title: "Collaboration Tools",
                description:
                  "Work seamlessly with your team using our collaboration features.",
                icon: <Aperture className="h-8 w-8 text-[#7f3fbf]" />,
              },
            ].map((feature, index) => (
              <Card key={index} className="bg-[#1a1a1a] border-[#2a2a2a]">
                <CardHeader className="items-center">
                  <div className="p-4 rounded-full bg-[#2a2a2a] mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-center">
                    {feature.description}
                  </p>
                </CardContent>
                <CardFooter className="justify-center">
                  <Button
                    variant="outline"
                    className="border-[#7f3fbf] text-[#7f3fbf] hover:bg-[#7f3fbf] hover:text-white"
                  >
                    Learn more
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 px-4 bg-[#1a1a1a]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Subscribe to our Newsletter
            </h2>
            <p className="text-gray-400 mb-8">
              Stay updated with our latest features and news.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto sm:max-w-xl">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus-visible:ring-[#7f3fbf] flex-1"
              />
              <Button className="bg-[#e50914] hover:bg-[#f12a34] text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] border-t border-[#2a2a2a] py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Aperture className="h-8 w-8 text-[#7f3fbf]" />
              <span className="text-xl font-bold text-white">Softec</span>
            </div>
            <p className="text-gray-400">
              Powerful management system for modern businesses.
            </p>
            <div className="flex space-x-4 mt-4">
              <Button
                variant="outline"
                size="icon"
                className="bg-[#2a2a2a] border-[#7f3fbf] text-white hover:bg-[#7f3fbf]"
              >
                <Github className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-[#2a2a2a] border-[#7f3fbf] text-white hover:bg-[#7f3fbf]"
              >
                <Aperture className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Press
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Status
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Mail className="mr-2 h-4 w-4" /> info@softec.com
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="mr-2 h-4 w-4" /> +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-[#2a2a2a] text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} Softec Management System. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
