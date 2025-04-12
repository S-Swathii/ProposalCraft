import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Zap, PieChart, Users, Clock, Shield } from "lucide-react";

const features = [
  {
    title: "Beautiful Proposals",
    description: "Create professional-looking proposals with a clean, modern design that impresses clients.",
    icon: FileText
  },
  {
    title: "Real-time Preview",
    description: "See exactly how your proposal will look as you create it with our live preview feature.",
    icon: Zap
  },
  {
    title: "Dynamic Pricing",
    description: "Automatically calculate totals as you add or modify items in your proposal pricing table.",
    icon: PieChart
  },
  {
    title: "Client Management",
    description: "Organize proposals by client and keep track of all your business opportunities in one place.",
    icon: Users
  },
  {
    title: "Save Time",
    description: "Use templates and save proposals to quickly create new business documents without starting from scratch.",
    icon: Clock
  },
  {
    title: "Secure Storage",
    description: "All your proposal data is stored securely, giving you peace of mind and easy access when you need it.",
    icon: Shield
  }
];

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header activePage="create" />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/5 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              About Proposal Builder
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              A powerful tool designed to help professionals create beautiful client proposals in minutes, not hours.
            </p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Our Story */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg text-gray-600 max-w-none">
              <p>
                Proposal Builder was created by a team of freelancers and small business owners who were tired of spending hours creating proposals in word processors and spreadsheets. We wanted a specialized tool that would make the process faster and produce more professional results.
              </p>
              <p>
                Launched in 2025, our mission is to help professionals win more business by creating impressive proposals that stand out from the competition. Whether you're a freelancer, agency, or small business, Proposal Builder gives you the tools to showcase your services professionally and close more deals.
              </p>
              <p>
                We're constantly improving the platform based on user feedback, adding new features and templates to make proposal creation even easier.
              </p>
            </div>
          </section>
          
          {/* Features */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="bg-primary/10 rounded-full p-3">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                        <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          
          {/* Testimonials */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What Our Users Say</h2>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <p className="text-gray-600 italic">
                    "This tool has saved me so much time. I used to spend hours creating proposals in Word, but now I can create a professional proposal in minutes."
                  </p>
                  <div className="mt-4">
                    <p className="font-medium text-gray-900">Alex Thompson</p>
                    <p className="text-sm text-gray-600">Web Developer</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <p className="text-gray-600 italic">
                    "My clients are impressed with the professional-looking proposals I send them. The templates are excellent and easy to customize."
                  </p>
                  <div className="mt-4">
                    <p className="font-medium text-gray-900">Sarah Johnson</p>
                    <p className="text-sm text-gray-600">Marketing Consultant</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}