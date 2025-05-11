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
    "https://www.techjuice.pk/wp-content/uploads/2020/03/SOFTEC-Cover-Ad.jpg",
    "https://www.techjuice.pk/wp-content/uploads/2020/03/SOFTEC-Cover-Ad.jpg",
    "https://www.techjuice.pk/wp-content/uploads/2020/03/SOFTEC-Cover-Ad.jpg",
  ];

  return (
    <div className="min-h-screen flex flex-col ">
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
                      className="w-full h-full object-center"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#2a2a2a] border-my-purple text-white hover:bg-my-purple" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#2a2a2a] border-my-purple text-white hover:bg-my-purple" />
          </Carousel>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold  text-center mb-12">
            Our Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Powerful Dashboard",
                description:
                  "Get insights and analytics at a glance with our intuitive dashboard.",
                icon: <Aperture className="h-8 w-8 text-my-purple" />,
              },
              {
                title: "Secure Access",
                description:
                  "Enterprise-grade security to protect your data and privacy.",
                icon: <Aperture className="h-8 w-8 text-my-purple" />,
              },
              {
                title: "Collaboration Tools",
                description:
                  "Work seamlessly with your team using our collaboration features.",
                icon: <Aperture className="h-8 w-8 text-my-purple" />,
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-my-border shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6 flex flex-col items-center h-full">
                  <div className="p-4 rounded-full border-2 border-my-purple mb-4">
                    {feature.icon}
                  </div>

                  <CardHeader className="p-0 w-full text-center">
                    <h3 className="text-lg font-semibold leading-tight break-words">
                      {feature.title}
                    </h3>
                  </CardHeader>

                  <CardContent className="flex-grow p-0 pt-2 text-center">
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>

                  <CardFooter className="p-0 pt-4">
                    <Button
                      variant="outline"
                      className="border-my-purple text-my-purple hover:bg-my-purple hover:text-white"
                    >
                      Learn more
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 px-4 border-t border-my-border">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold  mb-4">
              Subscribe to our Newsletter
            </h2>
            <p className=" mb-8">
              Stay updated with our latest features and news.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto sm:max-w-xl">
              <Input
                type="email"
                placeholder="Your email address"
                className="border-my-border focus-visible:ring-my-purple flex-1"
              />
              <Button className="bg-[#e50914] hover:bg-[#f12a34] text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="  border-my-border py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Aperture className="h-8 w-8 text-my-purple" />
              <span className="text-xl font-bold ">Softec</span>
            </div>
            <p className="">
              Powerful management system for modern businesses.
            </p>
            <div className="flex space-x-4 mt-4">
              <Button
                variant="outline"
                size="icon"
                className=" border-my-purple  hover:bg-my-purple"
              >
                <Github className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className=" border-my-purple  hover:bg-my-purple"
              >
                <Aperture className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="">
                  Press
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="">
                  Status
                </a>
              </li>
              <li>
                <a href="#" className="">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="mr-2 h-4 w-4" /> info@softec.com
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-4 w-4" /> +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-[#2a2a2a] text-center">
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
