"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Music, Zap, Heart, Clock } from "lucide-react";
import PageTransition from "@/components/PageTransition";

export default function LandingPage() {
  const [vibe, setVibe] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleGenerate() {
    if (!vibe.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibe }),
      });

      const data = await res.json();
      if (res.ok) {
        // Store in localStorage for next page
        localStorage.setItem("persona:currentSpec", JSON.stringify(data.spec));
        localStorage.setItem("persona:currentVibe", vibe);
        localStorage.setItem("persona:vibeId", data.vibeId);
        router.push("/spec-editor");
      }
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 via-indigo-900 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Turn your <span className="text-indigo-600">vibe</span> into music
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Describe your mood, energy, or moment and get a perfectly curated
              Spotify playlist in seconds
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Vibe Input */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 p-8 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Describe your vibe
              </h2>

              <textarea
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                placeholder="e.g., Upbeat morning workout energy, chill Sunday afternoon vibes, late night coding session..."
                className="w-full h-40 px-5 py-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 font-medium"
              />

              <button
                onClick={handleGenerate}
                disabled={!vibe.trim() || loading}
                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {loading ? "Generating..." : "Generate Playlist Spec"}
              </button>
            </div>

            {/* Right: AI Features */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 p-8 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                AI will analyze
              </h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-indigo-50/50 transition-colors duration-200">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl flex items-center justify-center shadow-sm">
                    <Music className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Musical genres and styles
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Match the perfect mix of genres
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-indigo-50/50 transition-colors duration-200">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl flex items-center justify-center shadow-sm">
                    <Zap className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Energy and tempo preferences
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Find the right intensity level
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-indigo-50/50 transition-colors duration-200">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl flex items-center justify-center shadow-sm">
                    <Heart className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Mood and emotional tone
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Capture the feeling you want
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-indigo-50/50 transition-colors duration-200">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl flex items-center justify-center shadow-sm">
                    <Clock className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Context and timing
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Perfect for your moment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
