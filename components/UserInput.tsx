"use client";

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setScanResults } from '@/lib/features/scanResults/scanResultsSlice';
import { RootState } from '@/lib/store';

const UserInput: React.FC = () => {
  const [scan, setScan] = useState<File | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const existingScanResults = useSelector((state: RootState) => state.scanResults.items);

  const handleScanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setScan(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let scanResults: { condition: string; description: string }[] = [];

    if (scan) {
      const formData = new FormData();
      formData.append("file", scan);

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        scanResults = JSON.parse(result.result);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }

    // Append new results to existing results and filter out duplicates
    const updatedScanResults = [...existingScanResults, ...scanResults].filter(
      (item, index, self) => index === self.findIndex((i) => i.condition === item.condition)
    );

    dispatch(setScanResults(updatedScanResults));
    router.push('/diagnosis');
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Upload X-ray or CT Scan</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
    </div>
  );
};

export default UserInput;