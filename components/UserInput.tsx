"use client";

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setScanResults } from '@/lib/features/scanResults/scanResultsSlice';
import { RootState } from '@/lib/store';

const UserInput: React.FC = () => {
  const [scan, setScan] = useState<File | null>(null);
  const [manualInput, setManualInput] = useState<string>("");
  const [patientId, setPatientId] = useState<string>("");
  const dispatch = useDispatch();
  const router = useRouter();
  const existingScanResults = useSelector((state: RootState) => state.scanResults.items);

  const handleScanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setScan(e.target.files[0]);
    }
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualInput(e.target.value);
  };

  const handlePatientIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientId(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let scanResults: { condition: string; description: string; confidence: number; recommendations: string[] }[] = [];

    if (scan) {
      const formData = new FormData();
      formData.append("file", scan);
      formData.append("patientId", patientId);

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("UserInput API Response:", result);
        scanResults = JSON.parse(result.result);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }

    if (manualInput) {
      const manualItems = manualInput.split(",").map(item => ({
        condition: item.trim().toLowerCase(),
        description: "Manual input",
        confidence: 0,
        recommendations: [],
      }));
      scanResults = [...scanResults, ...manualItems];
    }

    // Append new results to existing results and filter out duplicates
    const updatedScanResults = [...existingScanResults, ...scanResults].filter(
      (item, index, self) => index === self.findIndex((i) => i.condition === item.condition)
    );

    dispatch(setScanResults(updatedScanResults));
    router.push('/main');
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Upload X-ray or CT Scan</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          List your Disease (comma separated):
          <input
            type="text"
            value={manualInput}
            onChange={handleManualInputChange}
            className="border p-2 rounded"
          />
        </label>
        <label>
          Patient ID:
          <input
            type="text"
            value={patientId}
            onChange={handlePatientIdChange}
            className="border p-2 rounded"
          />
        </label>
        <label>
          Upload your X-ray or CT scan:
          <input
            type="file"
            accept="image/*"
            onChange={handleScanChange}
            className="border p-2 rounded"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Analyze
        </button>
      </form>
      {/* Display Scan Results */}
      {existingScanResults.length > 0 && (
        <div className="mt-8 w-full max-w-4xl">
          <h2 className="text-xl font-bold mb-4">Scan Results</h2>
          {existingScanResults.map((result, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
              <h3 className="text-lg font-bold">{result.condition}</h3>
              <p className="text-gray-600"><strong>Description:</strong> {result.description}</p>
              <p className="text-gray-600"><strong>Confidence:</strong> {result.confidence}%</p>
              <p className="text-gray-600"><strong>Recommendations:</strong></p>
              <ul className="list-disc list-inside">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserInput;