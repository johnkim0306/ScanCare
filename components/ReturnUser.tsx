"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ReturnUser: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/api/auth`);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Return User</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Enter your User Name or ID:
          <input
            type="text"
            value={userId}
            onChange={handleUserIdChange}
            className="border p-2 rounded"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReturnUser;