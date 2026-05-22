'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';
import { toast } from 'sonner';

interface UploadLRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipmentId: string | null;
}

export function UploadLRDialog({ open, onOpenChange, shipmentId }: UploadLRDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to Supabase storage
    setTimeout(() => {
      toast.success(`LR/Docket successfully uploaded for shipment ${shipmentId}.`);
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#1e212b] border-[#e8e5d7] dark:border-[#2a2e3d]">
        <DialogHeader>
          <DialogTitle className="text-[#111827] dark:text-white flex items-center gap-2">
            <FileUp className="h-5 w-5 text-[#f37a2a]" />
            Upload LR / Docket Copy
          </DialogTitle>
          <DialogDescription className="text-[#64748b] dark:text-[#94a3b8]">
            Attach the official transport copy for shipment <span className="font-bold text-black dark:text-white">{shipmentId}</span>. This will be visible to the client.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2 border-2 border-dashed border-gray-300 dark:border-[#2a2e3d] rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-[#16181d] transition">
            <FileUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Click or drag file to this area to upload</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Support for a single PDF or Image file.</p>
            <Input type="file" required className="mt-4 mx-auto w-fit bg-white dark:bg-[#1e212b] cursor-pointer file:text-sm file:font-semibold file:bg-[#f37a2a]/10 file:text-[#f37a2a] file:border-0 file:rounded-md file:mr-4 hover:file:bg-[#f37a2a]/20" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-[#2a2e3d]">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-[#f37a2a] hover:bg-[#e06716] text-white font-bold">
              {isSubmitting ? 'Uploading...' : 'Confirm Upload'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
