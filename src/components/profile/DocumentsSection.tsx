import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthContext } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  uploaded_at: string;
}

interface DocumentsSectionProps {
  documents: Document[];
  onUpload: (file: File) => void;
  onDelete: (documentId: string) => void;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents, onUpload, onDelete }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-lg mb-4">Documentos e Certificações</h3>
      
      <div className="mb-4">
        <label htmlFor="document-upload" className="flex items-center justify-center w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200">
          <i className="fas fa-cloud-upload-alt mr-2"></i>
          <span>{uploading ? 'Enviando...' : 'Adicionar Documento'}</span>
          <input id="document-upload" type="file" className="hidden" onChange={handleFileChange} disabled={uploading} />
        </label>
      </div>

      <div className="space-y-3">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <i className="fas fa-file-alt text-gray-500 mr-3"></i>
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  {doc.name}
                </a>
              </div>
              <button onClick={() => onDelete(doc.id)} className="text-red-500 hover:text-red-700">
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">Nenhum documento enviado.</p>
        )}
      </div>
    </div>
  );
};

export default DocumentsSection;