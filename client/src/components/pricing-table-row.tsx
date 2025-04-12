import { Dispatch, SetStateAction } from "react";
import { PricingItem } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface PricingTableRowProps {
  item: PricingItem;
  index: number;
  onUpdate: (index: number, field: keyof PricingItem, value: any) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export default function PricingTableRow({ 
  item, 
  index, 
  onUpdate, 
  onRemove,
  canRemove
}: PricingTableRowProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(index, 'name', e.target.value);
  };
  
  const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(index, 'unitPrice', parseFloat(e.target.value) || 0);
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(index, 'quantity', parseInt(e.target.value) || 1);
  };
  
  const total = item.unitPrice * item.quantity;
  
  const formattedTotal = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(total);
  
  return (
    <tr>
      <td className="px-3 py-2 whitespace-nowrap">
        <Input
          type="text"
          value={item.name}
          onChange={handleNameChange}
          placeholder="Item name"
          className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
        />
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <div className="flex items-center">
          <span className="text-gray-500 mr-1">$</span>
          <Input
            type="number"
            value={item.unitPrice}
            onChange={handleUnitPriceChange}
            min={0}
            step={0.01}
            className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
          />
        </div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <Input
          type="number"
          value={item.quantity}
          onChange={handleQuantityChange}
          min={1}
          step={1}
          className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
        />
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
        ${formattedTotal}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
        <Button 
          type="button" 
          onClick={() => onRemove(index)}
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700"
          disabled={!canRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}
