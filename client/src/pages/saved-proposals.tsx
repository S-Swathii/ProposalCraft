import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Trash2, Edit, Download } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { ProposalWithDate } from "@shared/schema";
import PrintButton from "@/components/ui/print-button";

export default function SavedProposals() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [proposalToPrint, setProposalToPrint] = useState<ProposalWithDate | null>(null);

  const { data: proposals, isLoading, error } = useQuery<ProposalWithDate[]>({
    queryKey: ['/api/proposals'],
  });

  const deleteProposalMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/proposals/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Proposal deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/proposals'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete proposal: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      deleteProposalMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const handleEdit = (id: number) => {
    setLocation(`/edit-proposal/${id}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, 'MMM d, yyyy');
  };

  const handleExport = (proposal: ProposalWithDate) => {
    setProposalToPrint(proposal);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header activePage="saved" />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="sm:flex sm:items-center mb-6">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">Saved Proposals</h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all your saved client proposals with client name and creation date.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <Button 
                className="inline-flex items-center"
                onClick={() => setLocation("/")}
              >
                Create new proposal
              </Button>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
              <h2 className="text-sm font-medium text-gray-500">RECENT PROPOSALS</h2>
            </div>
            
            {isLoading ? (
              <ul className="divide-y divide-gray-200">
                {[...Array(3)].map((_, index) => (
                  <li key={index} className="px-6 py-4">
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-60" />
                  </li>
                ))}
              </ul>
            ) : error ? (
              <div className="px-6 py-4 text-red-500">
                Failed to load proposals. Please try again.
              </div>
            ) : proposals?.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-500">
                <p>No proposals found. Create your first proposal!</p>
                <Button 
                  className="mt-4"
                  onClick={() => setLocation("/")}
                >
                  Create Proposal
                </Button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {proposals?.map((proposal) => (
                  <li key={proposal.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{proposal.clientName}</h3>
                      <div className="mt-1 flex items-center text-xs text-gray-500 space-x-1">
                        <span>Created on {proposal.createdAt ? formatDate(proposal.createdAt) : "N/A"}</span>
                        <span>•</span>
                        <span className="font-medium text-primary">{formatCurrency(proposal.totalAmount)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => proposal.id && handleEdit(proposal.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleExport(proposal)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => proposal.id && handleDelete(proposal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the proposal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hidden print component */}
      {proposalToPrint && (
        <PrintButton proposal={proposalToPrint} onClose={() => setProposalToPrint(null)} />
      )}
    </div>
  );
}
