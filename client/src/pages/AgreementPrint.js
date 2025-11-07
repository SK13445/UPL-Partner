import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/axios';

const AgreementPrint = () => {
  const { id } = useParams();

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await api.get(`/agreement/print/${id}`, {
          responseType: 'blob'
        });
        
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Agreement-${id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        // Also open in new window for printing
        window.open(url, '_blank');
      } catch (error) {
        console.error('Failed to generate PDF:', error);
        alert('Failed to generate PDF');
      }
    };

    fetchPDF();
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Generating Agreement PDF...</h2>
        <p className="text-gray-600">The PDF will open in a new window.</p>
      </div>
    </div>
  );
};

export default AgreementPrint;

