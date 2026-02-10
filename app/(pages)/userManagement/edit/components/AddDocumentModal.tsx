"use client";

import { useForm } from "react-hook-form";
import {
  useUploadUserDocumentMutation,
  useUpdateUserDocumentMutation,
} from "../../query";
import { toast } from "sonner";
import { useEffect } from "react";

export default function AddDocumentModal({
  isOpen,
  onClose,
  userId,
  editingDoc,
}: {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  editingDoc?: any;
}) {
  const { register, handleSubmit, reset } = useForm();
  const { mutateAsync: uploadDoc, isPending: isUploading } =
    useUploadUserDocumentMutation(userId);
  const { mutateAsync: updateDoc, isPending: isUpdating } =
    useUpdateUserDocumentMutation(userId);

  useEffect(() => {
    if (editingDoc) {
      reset({
        title: editingDoc.title,
        description: editingDoc.description || "",
        expiryDate: editingDoc.expiryDate
          ? new Date(editingDoc.expiryDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      reset({
        title: "",
        description: "",
        expiryDate: "",
      });
    }
  }, [editingDoc, reset, isOpen]);

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("expiryDate", data.expiryDate || "");

      if (data.file && data.file[0]) {
        formData.append("file", data.file[0]);
      }

      if (editingDoc) {
        await updateDoc({ docId: editingDoc.id, formData });
        toast.success("Document updated successfully");
      } else {
        if (!data.file || !data.file[0]) {
          toast.error("Please select a file to upload");
          return;
        }
        await uploadDoc(formData);
        toast.success("Document uploaded successfully");
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-black">
            {editingDoc ? "Edit Document" : "Add New Document"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          <div>
            <label className="block text-sm font-bold text-black mb-1">
              Document Title
            </label>
            <input
              {...register("title", { required: true })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#004953] outline-none transition-all"
              placeholder="e.g. Identity Document"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1">
              Description (Optional)
            </label>
            <textarea
              {...register("description")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#004953] outline-none transition-all"
              placeholder="Brief details about the document..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                {...register("expiryDate")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#004953] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                {editingDoc ? "Replace File" : "Upload File"}
              </label>
              <input
                type="file"
                {...register("file")}
                className="w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#004953]/10 file:text-[#004953] hover:file:bg-[#004953]/20 transition-all font-bold"
                accept="application/pdf,image/*"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-black font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || isUpdating}
              className="flex-[2] px-8 py-2.5 bg-[#004953] text-white rounded-xl font-bold hover:bg-[#003941] disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#004953]/20"
            >
              {(isUploading || isUpdating) && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              )}
              {editingDoc ? "Update Document" : "Upload Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
