import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// FAQ content
const FAQs = [
  {
    question: "How do I create a new proposal?",
    answer: "Navigate to the 'Create Proposal' page from the main navigation. Fill in the client details, select services, add pricing items, and set a timeline. You'll see a live preview of your proposal on the right side of the screen. When you're ready, click 'Save Proposal' to store it."
  },
  {
    question: "Can I edit a proposal after saving it?",
    answer: "Yes! Go to the 'Saved Proposals' page, find the proposal you want to modify, and click the edit icon. This will load the proposal into the editor where you can make changes and save again."
  },
  {
    question: "How do I export a proposal to PDF?",
    answer: "There are two ways to export a proposal to PDF: 1) On the 'Create Proposal' page, click the 'Export PDF' button in the top right corner, or 2) On the 'Saved Proposals' page, find the proposal you want to export and click the download icon."
  },
  {
    question: "Can I use templates for common proposal types?",
    answer: "Yes! Visit the 'Templates' page to see a collection of pre-designed proposals for different services. When you select a template, it will be loaded into the editor where you can customize it for your specific client."
  },
  {
    question: "How is the total price calculated?",
    answer: "The total price is automatically calculated by multiplying the unit price by the quantity for each pricing item, then summing all items. As you add or modify pricing items, the total will update in real-time in both the form and the preview."
  },
  {
    question: "Can I add my company logo to proposals?",
    answer: "This feature is coming soon! In a future update, you'll be able to upload your company logo and customize the appearance of your proposals with your branding."
  },
  {
    question: "Is my proposal data stored securely?",
    answer: "Yes, all your proposal data is stored securely. We use modern security practices to ensure that your client information and proposal details are protected."
  },
  {
    question: "Can I delete a proposal?",
    answer: "Yes. On the 'Saved Proposals' page, find the proposal you want to remove and click the trash icon. You'll be asked to confirm before the proposal is permanently deleted."
  }
];

export default function FAQ() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header activePage="create" />
      
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
            <p className="mt-4 text-gray-600">
              Find answers to common questions about using the Proposal Builder tool.
            </p>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg overflow-hidden p-6">
            <Accordion type="single" collapsible className="w-full">
              {FAQs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium text-gray-900">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-10 text-center">
            <h2 className="text-xl font-semibold text-gray-900">Still have questions?</h2>
            <p className="mt-2 text-gray-600">
              If you couldn't find the answer you were looking for, please contact our support team.
            </p>
            <div className="mt-4">
              <a 
                href="mailto:support@proposalbuilder.com" 
                className="text-primary hover:underline"
              >
                support@proposalbuilder.com
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}