"use client";

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setFoodItems } from '@/lib/features/foodItems/foodItemsSlice';
import { RootState } from '@/lib/store';

const UserInput: React.FC = () => {
  const [receipt, setReceipt] = useState<File | null>(null);
  const [manualInput, setManualInput] = useState<string>("");
  const dispatch = useDispatch();
  const router = useRouter();
  const existingFoodItems = useSelector((state: RootState) => state.foodItems.items);

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setReceipt(e.target.files[0]);
    }
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let foodItems: { name: string; expiry: number }[] = [];

    if (receipt) {
      const formData = new FormData();
      formData.append("file", receipt);

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        foodItems = JSON.parse(result.result);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }

    if (manualInput) {
      const manualItems = manualInput.split(",").map(item => ({
        name: item.trim().toLowerCase(),
        expiry: 7, // Default expiry for manual input
      }));
      foodItems = [...foodItems, ...manualItems];
    }

    // Append new items to existing items and filter out duplicates
    const updatedFoodItems = [...existingFoodItems, ...foodItems].filter(
      (item, index, self) => index === self.findIndex((i) => i.name === item.name)
    );

    dispatch(setFoodItems(updatedFoodItems));
    router.push('/main');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Upload Grocery Receipt or Enter Food Items</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          List your food items (comma separated):
          <input
            type="text"
            value={manualInput}
            onChange={handleManualInputChange}
            className="border p-2 rounded"
          />
        </label>
        <label>
          Upload your grocery receipt:
          <input
            type="file"
            accept="image/*"
            onChange={handleReceiptChange}
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