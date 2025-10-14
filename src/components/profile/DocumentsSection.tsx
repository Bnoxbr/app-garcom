import React, { useState, useCallback } from 'react';
import { Upload, FileText, Trash2, AlertCircle } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  uploaded_at: string;
}

interface DocumentsSectionProps {
  documents: Document[];
  onDocumentUpload: (file: File) => void;
  onDocumentDelete: (documentId: string) => void;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents, onDocumentUpload, onDocumentDelete }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      await onDocumentUpload(file);
    } catch (err) {
      setError('Falha no upload do documento.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  }, [onDocumentUpload]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Documentos</h3>
      <div className="mb-4">
        <label htmlFor="document-upload" className={`flex items-center justify-center w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <Upload className="w-5 h-5 mr-2" />
          <span>{uploading ? 'Enviando...' : 'Adicionar Novo Documento'}</span>
          <input id="document-upload" type="file" className="hidden" onChange={handleFileChange} disabled={uploading} />
        </label>
        {error && <p className="text-red-500 text-sm mt-2 flex items-center"><AlertCircle className='w-4 h-4 mr-1'/>{error}</p>}
      </div>
      <div className="space-y-3">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
              <div className="flex items-center truncate">
                <FileText className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate" title={doc.name}>
                  {doc.name}
                </a>
              </div>
              <button onClick={() => onDocumentDelete(doc.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">Nenhum documento enviado.</p>
        )}
      </div>
    </div>
  );
};

export default DocumentsSection;