import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Aperture, Github, Home, Mail, Phone } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="relative h-[400px] w-full flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h2>
            <p className="text-xl mb-8">
              We'd love to hear from you. Get in touch with our team.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 max-w-4xl mx-auto flex align-center justify-center">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Send us a message</h2>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="">
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter Name"
                    className=" border-gray-600 text-white placeholder-gray-400 focus-visible:ring-my-purple"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter e-mail"
                    className="border-gray-600 placeholder-gray-400 focus-visible:ring-my-purple"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="">
                    Message
                  </Label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Enter Message"
                    className="flex w-full rounded-md border border-gray-600 px-3 py-2 text-sm placeholder-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-my-purple focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e0e]"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-my-purple hover:bg-[#9d5bdf] text-white px-8 py-6 text-lg w-full"
                >
                  Send Message
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-my-purple mt-1 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email</h3>
                    <p className="">info@softec.com</p>
                    <p className="">support@softec.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-my-purple mt-1 mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Phone</h3>
                    <p className="">+1 (555) 123-4567</p>
                    <p className="">Mon-Fri, 9am-5pm EST</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Home className="h-6 w-6 text-my-purple mt-1 mr-4" />
                  <div>
                    <h3 className="text-lg font-semiboldmb-1">Office</h3>
                    <p className="">123 Business Ave</p>
                    <p className="">New York, NY 10001</p>
                    <p className="">United States</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    className="border-my-purple hover:bg-my-purple hover:text-white"
                  >
                    <Github className="h-5 w-5 mr-2" /> GitHub
                  </Button>
                  <Button
                    variant="outline"
                    className="border-my-purple hover:bg-my-purple hover:text-white"
                  >
                    <Aperture className="h-5 w-5 mr-2" /> Twitter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#2a2a2a] py-8 px-4"></footer>
    </div>
  );
};

export default Contact;
