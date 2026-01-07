import React from "react";
import axiosInstance from "@/lib/axios";
interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  // allow onConfirm to be sync or async
  onConfirm: () => void | Promise<void>;
  itemName: string;
  // make the following optional so component can be used with minimal props
  deleteId?: string | null;
  endpoint?: string;
  deleteLoading?: boolean;
  onSuccess?: () => void;
}


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";



const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  deleteLoading = false,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (err) {
      console.error('Error in onConfirm:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{itemName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleConfirm}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmation;
