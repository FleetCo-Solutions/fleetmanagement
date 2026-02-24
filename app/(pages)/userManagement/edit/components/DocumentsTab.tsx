"use client";

import { useState } from "react";
import {
  useUserDocumentsQuery,
  useUserDocumentsSummaryQuery,
  useDeleteUserDocumentMutation,
} from "../../query";
import { toast } from "sonner";
import AddDocumentModal from "./AddDocumentModal";
import ConfirmationModal from "@/app/components/ConfirmationModal";

export default function DocumentsTab({ userId }: { userId: string }) {
  const { data: summary, isLoading: isSummaryLoading } =
    useUserDocumentsSummaryQuery(userId);
  const { data: documents, isLoading: isDocsLoading } =
    useUserDocumentsQuery(userId);
  const { mutateAsync: deleteDoc } = useDeleteUserDocumentMutation(userId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const getStatusColor = (expiryDate: string | null) => {
    if (!expiryDate) return "bg-blue-50 border-blue-400";
    const now = new Date();
    const expiry = new Date(expiryDate);

    now.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "bg-red-50 border-red-400";
    if (diffDays <= 30) return "bg-orange-50 border-orange-400";
    return "bg-blue-50 border-blue-400";
  };

  const handleDeleteClick = (docId: string) => {
    setDocToDelete(docId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!docToDelete) return;

    toast.promise(deleteDoc(docToDelete), {
      loading: "Deleting document...",
      success: "Document deleted successfully",
      error: "Failed to delete document",
    });
    setDeleteModalOpen(false);
    setDocToDelete(null);
  };

  const handleViewDoc = (doc: any) => {
    setSelectedDoc(doc);
    setViewerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Overview Counters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-black/20 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-[#004953]">
            {summary?.total || 0}
          </div>
          <div className="text-sm text-gray-700">Total Documents</div>
        </div>
        <div className="bg-white border border-black/20 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-orange-600">
            {summary?.expiringSoon || 0}
          </div>
          <div className="text-sm text-gray-700">Expiring Soon</div>
        </div>
        <div className="bg-white border border-black/20 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-red-600">
            {summary?.expired || 0}
          </div>
          <div className="text-sm text-gray-700">Expired</div>
        </div>
        <button
          onClick={() => {
            setEditingDoc(null);
            setIsModalOpen(true);
          }}
          className="bg-[#004953] text-white rounded-xl p-4 shadow-sm hover:bg-[#003941] transition-colors flex items-center justify-center gap-2 font-bold"
        >
          <span>Add Document</span>
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>

      {/* Document List */}
      <div className="bg-white border border-black/20 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-black mb-4">User Documents</h3>
        <div className="space-y-3">
          {(isDocsLoading || isSummaryLoading) && (
            <div className="text-center py-4">Loading documents...</div>
          )}
          {!isDocsLoading && documents?.length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg border-black/10">
              No documents uploaded yet.
            </div>
          )}
          {documents?.map((doc: any) => (
            <div
              key={doc.id}
              className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${getStatusColor(doc.expiryDate)}`}
            >
              <div className="flex-1">
                <div className="font-semibold text-black flex flex-wrap items-center gap-2">
                  <span>{doc.title}</span>
                  {doc.documentType && (
                    <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-[#004953]/10 text-[#004953] rounded-full border border-[#004953]/20">
                      {doc.documentType.name}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  {doc.expiryDate
                    ? `Expires: ${new Date(doc.expiryDate).toLocaleDateString()}`
                    : "No expiry date"}
                </div>
                {doc.description && (
                  <p className="text-xs text-gray-500 mt-1 italic">
                    "{doc.description}"
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewDoc(doc)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors text-[#004953]"
                  title="View Document"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.399 9.949 5.768 8 9 8s5.601 1.949 6.964 3.678c.366.466.366 1.054 0 1.52A11.513 11.513 0 0 1 9 16c-3.232 0-5.601-1.949-6.964-3.678Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setEditingDoc(doc);
                    setIsModalOpen(true);
                  }}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors text-blue-600"
                  title="Edit/Re-upload"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteClick(doc.id)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors text-red-600"
                  title="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddDocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userId}
        editingDoc={editingDoc}
      />

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Document"
        message="Are you sure you want to delete this document? This will also remove the file from storage."
        confirmText="Delete"
        variant="danger"
        isLoading={false}
      />

      {/* Document Viewer Modal */}
      {viewerOpen && selectedDoc && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-black leading-tight">
                  {selectedDoc.title}
                </h2>
                <p className="text-xs text-gray-500">
                  {selectedDoc.storagePath}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={selectedDoc.storageUrl}
                  download
                  className="p-2 hover:bg-black/5 rounded-full transition-colors text-blue-600"
                  title="Download"
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
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 12l4.5 4.5m0 0 4.5-4.5M12 3v13.5"
                    />
                  </svg>
                </a>
                <button
                  onClick={() => setViewerOpen(false)}
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
            </div>
            <div className="flex-1 bg-gray-100 relative overflow-hidden">
              {selectedDoc.storageUrl.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={`${selectedDoc.storageUrl}#toolbar=0`}
                  className="w-full h-full border-none"
                  title={selectedDoc.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <img
                    src={selectedDoc.storageUrl}
                    alt={selectedDoc.title}
                    className="max-w-full max-h-full object-contain shadow-lg rounded"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
