import { useState, useRef, useEffect } from "react";
import { useReactToPrint } from 'react-to-print';
import { ProposalWithDate } from "@shared/schema";
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PrintButtonProps {
  proposal: ProposalWithDate;
  onClose: () => void;
}

export default function PrintButton({ proposal, onClose }: PrintButtonProps) {
  const [isOpen, setIsOpen] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      return '';
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Proposal - ${proposal.clientName}`,
    onAfterPrint: handleClose,
  });

  useEffect(() => {
    // Auto-trigger print when component mounts
    if (printRef.current) {
      setTimeout(() => {
        handlePrint();
      }, 300);
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Print Preview</DialogTitle>
          <DialogDescription>Review the proposal before printing</DialogDescription>
        </DialogHeader>
        
        <div ref={printRef} className="p-8 bg-white">
          <div className="max-w-3xl mx-auto">
            {/* Proposal Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Proposal</h1>
              <p className="text-gray-500">
                Prepared for <span className="font-medium text-gray-800">{proposal.clientName}</span>
              </p>
              <p className="text-gray-500">
                {proposal.createdAt ? format(new Date(proposal.createdAt), 'MMMM d, yyyy') : format(new Date(), 'MMMM d, yyyy')}
              </p>
            </div>
            
            {/* Proposal Content */}
            <div className="space-y-6">
              {/* Overview */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Overview</h2>
                <p className="text-gray-700 leading-relaxed">
                  Thank you for considering our services. This proposal outlines the scope of work, timeline, and pricing for your project. We're committed to delivering quality work that meets your specific needs and expectations.
                </p>
              </section>
              
              {/* Services */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Services</h2>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {proposal.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </section>
              
              {/* Pricing */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Pricing</h2>
                <div className="overflow-hidden border border-gray-200 rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {proposal.pricing.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">${formatCurrency(item.unitPrice)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">${formatCurrency(item.unitPrice * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Total Amount:</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">${formatCurrency(proposal.totalAmount)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </section>
              
              {/* Timeline */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Project Timeline</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Start Date:</span>{' '}
                    <span className="text-gray-900">{formatDate(proposal.startDate)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">End Date:</span>{' '}
                    <span className="text-gray-900">{formatDate(proposal.endDate)}</span>
                  </div>
                </div>
              </section>
              
              {/* Notes */}
              {proposal.notes && (
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Additional Notes</h2>
                  <p className="text-gray-700 leading-relaxed">{proposal.notes}</p>
                </section>
              )}
              
              {/* Terms */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Terms & Conditions</h2>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>50% payment due upon project commencement.</li>
                  <li>Remaining balance due upon project completion.</li>
                  <li>Proposal valid for 30 days from the date of issue.</li>
                  <li>Changes to project scope may affect timeline and cost.</li>
                </ul>
              </section>
            </div>
            
            {/* Signature */}
            <div className="mt-10 pt-6 border-t border-gray-200 text-gray-500">
              <p className="mb-2">To accept this proposal, please sign below:</p>
              <div className="mt-4 grid grid-cols-2 gap-8">
                <div>
                  <div className="border-b border-gray-300 pb-1 mb-1"></div>
                  <p>Client Signature</p>
                </div>
                <div>
                  <div className="border-b border-gray-300 pb-1 mb-1"></div>
                  <p>Date</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handlePrint}>
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
