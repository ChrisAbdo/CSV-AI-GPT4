"use client";

import type { NextPage } from "next";
import CSVUploader from "@/components/CSVUploader";
import { useRef, useState } from "react";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");

  const [generatedBios, setGeneratedBios] = useState<String>("");

  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const prompt = "tell me a joke";

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedBios((prev) => prev + chunkValue);
    }
    scrollToBios();
    setLoading(false);
  };

  return (
    <div>
      <CSVUploader />

      <button onClick={generateBio}>Generate Bio</button>

      <div className="space-y-10 my-10">
        {generatedBios && (
          <>
            <div>
              <h2
                className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                ref={bioRef}
              >
                Your generated bios
              </h2>
            </div>
            <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
              {generatedBios
                .substring(generatedBios.indexOf("1") + 3)
                .split("2.")
                .map((generatedBio) => {
                  return (
                    <div
                      className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedBio);
                      }}
                      key={generatedBio}
                    >
                      <p>{generatedBio}</p>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
