import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ProposalWithDate } from "@shared/schema";
import { format } from "date-fns";

// Template proposals
const TEMPLATES: ProposalWithDate[] = [
  {
    id: 1,
    clientName: "Web Design Template",
    services: ["Web Design", "UI/UX Design"],
    pricing: [
      { id: "1", name: "Wireframing & Prototyping", unitPrice: 1500, quantity: 1 },
      { id: "2", name: "Responsive Design", unitPrice: 2000, quantity: 1 },
      { id: "3", name: "Design Revisions", unitPrice: 500, quantity: 2 }
    ],
    startDate: format(new Date(new Date().setDate(new Date().getDate() + 7)), "yyyy-MM-dd"),
    endDate: format(new Date(new Date().setDate(new Date().getDate() + 21)), "yyyy-MM-dd"),
    notes: "This template is ideal for website redesign projects. Includes wireframing, full responsive design, and two rounds of revisions.",
    totalAmount: 4500,
    createdAt: new Date()
  },
  {
    id: 2,
    clientName: "Digital Marketing Template",
    services: ["Digital Marketing", "SEO Optimization", "Content Creation"],
    pricing: [
      { id: "1", name: "SEO Audit & Strategy", unitPrice: 1200, quantity: 1 },
      { id: "2", name: "Content Calendar (3 months)", unitPrice: 1500, quantity: 1 },
      { id: "3", name: "Monthly Analytics Report", unitPrice: 400, quantity: 3 }
    ],
    startDate: format(new Date(new Date().setDate(new Date().getDate() + 5)), "yyyy-MM-dd"),
    endDate: format(new Date(new Date().setDate(new Date().getDate() + 95)), "yyyy-MM-dd"),
    notes: "Comprehensive digital marketing package for businesses looking to improve their online presence. Includes initial SEO audit, 3-month content strategy, and monthly performance reporting.",
    totalAmount: 3900,
    createdAt: new Date()
  },
  {
    id: 3,
    clientName: "E-commerce Development Template",
    services: ["Web Development", "Hosting & Maintenance"],
    pricing: [
      { id: "1", name: "E-commerce Platform Setup", unitPrice: 3000, quantity: 1 },
      { id: "2", name: "Product Import (up to 100 products)", unitPrice: 500, quantity: 1 },
      { id: "3", name: "Payment Gateway Integration", unitPrice: 400, quantity: 2 },
      { id: "4", name: "Monthly Maintenance", unitPrice: 300, quantity: 6 }
    ],
    startDate: format(new Date(new Date().setDate(new Date().getDate() + 10)), "yyyy-MM-dd"),
    endDate: format(new Date(new Date().setDate(new Date().getDate() + 40)), "yyyy-MM-dd"),
    notes: "Complete e-commerce development package. Includes platform setup, product import, payment gateway integrations, and 6 months of maintenance.",
    totalAmount: 5800,
    createdAt: new Date()
  }
];

export default function Templates() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const handleUseTemplate = (template: ProposalWithDate) => {
    // Store template in localStorage to use it in the create page
    localStorage.setItem("proposal_template", JSON.stringify(template));
    
    toast({
      title: "Template Selected",
      description: "Template loaded successfully. You can now customize it.",
    });
    
    // Redirect to create page
    setLocation("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header activePage="create" />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Proposal Templates</h1>
            <p className="mt-2 text-sm text-gray-700">
              Choose a template to get started quickly. You can customize all details after selecting a template.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{template.clientName}</CardTitle>
                  <CardDescription>
                    {template.services.join(", ")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Price Range:</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${template.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Timeline:</span>
                      <span className="text-sm text-gray-900">
                        {template.startDate.split('-')[1]}/{template.startDate.split('-')[2]} - {template.endDate.split('-')[1]}/{template.endDate.split('-')[2]}
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {template.notes}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleUseTemplate(template)}
                  >
                    Use This Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}