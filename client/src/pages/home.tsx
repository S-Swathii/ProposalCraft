import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProposalForm from "@/components/proposal-form";
import ProposalPreview from "@/components/proposal-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProposalWithDate, PricingItem } from "@shared/schema";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import useMobile from "@/hooks/use-mobile";

export default function Home() {
  const isMobile = useMobile();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [proposal, setProposal] = useState<ProposalWithDate>({
    clientName: "",
    services: [],
    pricing: [],
    startDate: "",
    endDate: "",
    notes: "",
    totalAmount: 0
  });

  const createProposalMutation = useMutation({
    mutationFn: async (data: ProposalWithDate) => {
      const res = await apiRequest("POST", "/api/proposals", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Proposal saved successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/proposals'] });
      setLocation("/saved-proposals");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save proposal: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const calculateTotal = (items: PricingItem[]): number => {
    return items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  };

  const handleFormChange = (updatedProposal: Partial<ProposalWithDate>) => {
    setProposal(prev => {
      const newProposal = { ...prev, ...updatedProposal };
      
      // Calculate total if pricing changed
      if (updatedProposal.pricing) {
        newProposal.totalAmount = calculateTotal(updatedProposal.pricing);
      }
      
      return newProposal;
    });
  };

  const handleSaveProposal = () => {
    const currentDate = new Date();
    createProposalMutation.mutate({
      ...proposal,
      createdAt: currentDate
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header activePage="create" />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {isMobile ? (
            <Tabs defaultValue="form" className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="form">Form</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="form" className="mt-4">
                <ProposalForm 
                  proposal={proposal} 
                  onChange={handleFormChange} 
                  onSave={handleSaveProposal}
                  isLoading={createProposalMutation.isPending}
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <ProposalPreview proposal={proposal} />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-1/2">
                <ProposalForm 
                  proposal={proposal} 
                  onChange={handleFormChange} 
                  onSave={handleSaveProposal}
                  isLoading={createProposalMutation.isPending}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <ProposalPreview proposal={proposal} />
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
