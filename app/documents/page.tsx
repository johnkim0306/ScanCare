// app/documents/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function DocumentsPage() {
  const searchParams = useSearchParams();
  const accessToken = searchParams.get('access_token');
  const patientId = searchParams.get('patientId');

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accessToken || !patientId) {
      setError('Missing access token or patient ID');
      setLoading(false);
      return;
    }

    // Fetch documents
    const fetchDocuments = async () => {
      try {
        const response = await fetch(
          `/api/patient-documents?access_token=${accessToken}&patientId=${patientId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch documents: ${response.statusText}`);
        }

        const data = await response.json();
        setDocuments(data.documents.entry || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [accessToken, patientId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Patient Documents</h1>
      {documents.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <ul>
          {documents.map((doc) => (
            <li key={doc.resource.id}>
              <h2>{doc.resource.description}</h2>
              <img
                src={doc.resource.content[0].attachment.url}
                alt={doc.resource.description}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}