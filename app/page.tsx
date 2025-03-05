"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserInput from "@/components/UserInput";
import Refrigerator from "@/components/Refrigerator";
import ReactQueryProvider from "@/components/ReactQueryProvider";

export default function Home() {
  const [foodItems, setFoodItems] = useState<{ name: string; expiry: number }[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (submitted) {
      router.push('/main');
    }
  }, [submitted, router]);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen gap-16 p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center justify-center text-center p-8 w-full">
        <section id="landing" className="max-w-4xl">
          <h1 className="text-5xl font-bold text-blue-600 mb-8">
            From Wallet to Plate, No Food Waste Delivers Nutritious Savings!
          </h1>
          <div className="gap-12 grid grid-cols-1 sm:grid-cols-3 mt-14">
            <div className="flex flex-col relative overflow-hidden bg-content1 shadow-md rounded-lg p-4">
              <p className="text-4xl font-bold mb-2">
                <span className="text-blue-500">2.9+</span> People
              </p>
              <hr className="my-2 border-gray-300" />
              <p>unable to afford a healthy diet</p>
            </div>
            <div className="flex flex-col relative overflow-hidden bg-content1 shadow-md rounded-lg p-4">
              <p className="text-4xl font-bold text-blue-500 mb-2">39%</p>
              <hr className="my-2 border-gray-300" />
              <p>increase in global food prices</p>
            </div>
            <div className="flex flex-col relative overflow-hidden bg-content1 shadow-md rounded-lg p-4">
              <p className="text-4xl font-bold mb-2">
                <span className="text-blue-500">12M</span> Deaths
              </p>
              <hr className="my-2 border-gray-300" />
              <p>linked to poor diet and nutrition</p>
            </div>
          </div>
          <p className="mt-14 leading-relaxed">
            <span className="text-blue-500">No Food Waste</span> is dedicated to
            supporting individuals facing financial constraints by offering
            personalized, budget-friendly{" "}
            <span className="text-blue-500">meal recommendations</span>. We
            recognize the challenges of stretching limited resources, which is
            why we specialize in providing{" "}
            <span className="text-blue-500">nutritious</span> meal options
            tailored to tight budgets. With No Food Waste, you can enjoy satisfying
            meals without breaking the bank, ensuring that everyone has access
            to <span className="text-blue-500">affordable</span>, nourishing
            food choices. Let us be your partner in making healthy eating{" "}
            <span className="text-blue-500">accessible</span> to all.
          </p>
        </section>
      </main>

      {/* User Input and Refrigerator */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-8 rounded-lg shadow-lg">
        <ReactQueryProvider>
            <UserInput />
        </ReactQueryProvider>
        <Refrigerator />
      </div>
    </div>
  );
}