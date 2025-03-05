"use client";

import ReactQueryProvider from "@/components/ReactQueryProvider";
import UserInput from "@/components/UserInput";

export default function Home() {

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen gap-16 p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center justify-center text-center p-8 w-full">
        <section id="landing" className="max-w-4xl">
          <h1 className="text-5xl font-bold text-blue-600 mb-8">
            AI-Powered X-ray & CT Scan Disease Detection
          </h1>
          <p className="mt-4 leading-relaxed text-lg">
            <span className="text-blue-500">ScanCare</span> leverages cutting-edge AI technology to analyze medical images and detect potential diseases. Simply upload an X-ray or CT scan, and our AI will provide insights on potential diagnoses along with treatment and dietary recommendations.
          </p>
          <div className="gap-12 grid grid-cols-1 sm:grid-cols-3 mt-14">
            <div className="flex flex-col relative overflow-hidden bg-content1 shadow-md rounded-lg p-4">
              <p className="text-4xl font-bold text-blue-500 mb-2">95%+</p>
              <hr className="my-2 border-gray-300" />
              <p>accuracy in AI-driven diagnosis</p>
            </div>
            <div className="flex flex-col relative overflow-hidden bg-content1 shadow-md rounded-lg p-4">
              <p className="text-4xl font-bold text-blue-500 mb-2">1M+</p>
              <hr className="my-2 border-gray-300" />
              <p>medical images analyzed</p>
            </div>
            <div className="flex flex-col relative overflow-hidden bg-content1 shadow-md rounded-lg p-4">
              <p className="text-4xl font-bold text-blue-500 mb-2">Instant Results</p>
              <hr className="my-2 border-gray-300" />
              <p>AI-powered analysis in seconds</p>
            </div>
          </div>
        </section>
      </main>

      {/* Image Upload and Diagnosis Result */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-8 rounded-lg shadow-lg w-full">
        <ReactQueryProvider>
          <UserInput />
        </ReactQueryProvider>
      </div>
    </div>
  );
}
