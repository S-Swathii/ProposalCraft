import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ProposalWithDate, proposalSchema } from "@shared/schema";
import { availableServices } from "@/lib/data";

interface ProposalFormProps {
  proposal: ProposalWithDate;
  onChange: (proposal: Partial<ProposalWithDate>) => void;
  onSave: () => void;
  isLoading: boolean;
}

export default function ProposalForm({ proposal, onChange, onSave, isLoading }: ProposalFormProps) {
  const form = useForm<ProposalWithDate>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      clientName: proposal.clientName || "",
      services: proposal.services || [],
      pricing: proposal.pricing?.length ? proposal.pricing : [{ id: uuidv4(), name: '', unitPrice: 0, quantity: 1 }],
      startDate: proposal.startDate || "",
      endDate: proposal.endDate || "",
      notes: proposal.notes || "",
      totalAmount: proposal.totalAmount || 0
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pricing"
  });

  // Watch for form value changes and propagate to parent
  const formValues = form.watch();
  
  useEffect(() => {
    // Only update parent if values actually changed
    const isDifferent = JSON.stringify(formValues) !== JSON.stringify(proposal);
    if (isDifferent) {
      onChange(formValues);
    }
  }, [formValues, onChange, proposal]);

  const handleSubmit = form.handleSubmit(() => {
    onSave();
  });

  const handleAddPricingItem = () => {
    append({ id: uuidv4(), name: '', unitPrice: 0, quantity: 1 });
  };

  const calculateRowTotal = (unitPrice: number, quantity: number): string => {
    const total = unitPrice * quantity;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(total);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Create New Proposal</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Information */}
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Services */}
            <div>
              <FormLabel className="block mb-3">Services *</FormLabel>
              <div className="space-y-2">
                {availableServices.map((service) => (
                  <FormField
                    key={service.id}
                    control={form.control}
                    name="services"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(service.name)}
                            onCheckedChange={(checked) => {
                              const updatedServices = checked
                                ? [...field.value, service.name]
                                : field.value?.filter((value) => value !== service.name) || [];
                              field.onChange(updatedServices);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{service.name}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              {form.formState.errors.services && (
                <FormMessage>{form.formState.errors.services.message}</FormMessage>
              )}
            </div>

            {/* Pricing */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <FormLabel>Pricing *</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-sm flex items-center gap-1"
                  onClick={handleAddPricingItem}
                >
                  <Plus className="h-4 w-4" /> Add Item
                </Button>
              </div>
              
              <div className="overflow-x-auto border border-gray-200 rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="relative px-3 py-2">
                        <span className="sr-only">Delete</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fields.map((field, index) => (
                      <tr key={field.id}>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <FormField
                            control={form.control}
                            name={`pricing.${index}.name`}
                            render={({ field }) => (
                              <FormControl>
                                <Input
                                  placeholder="Item name"
                                  className="border-0 p-0 h-8 focus-visible:ring-0"
                                  {...field}
                                />
                              </FormControl>
                            )}
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-1">$</span>
                            <FormField
                              control={form.control}
                              name={`pricing.${index}.unitPrice`}
                              render={({ field }) => (
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="border-0 p-0 h-8 focus-visible:ring-0"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </FormControl>
                              )}
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <FormField
                            control={form.control}
                            name={`pricing.${index}.quantity`}
                            render={({ field }) => (
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  step="1"
                                  className="border-0 p-0 h-8 focus-visible:ring-0"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                />
                              </FormControl>
                            )}
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${calculateRowTotal(form.watch(`pricing.${index}.unitPrice`), form.watch(`pricing.${index}.quantity`))}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                            onClick={() => fields.length > 1 && remove(index)}
                            disabled={fields.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-3 py-2 text-right text-sm font-medium text-gray-700">Total:</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${new Intl.NumberFormat('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }).format(form.watch('totalAmount'))}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {form.formState.errors.pricing && (
                <FormMessage>{form.formState.errors.pricing.message}</FormMessage>
              )}
            </div>

            {/* Timeline */}
            <div>
              <FormLabel className="block mb-3">Timeline *</FormLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-500 text-sm">Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-500 text-sm">End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional information or special requirements" 
                      rows={4} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Proposal"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
