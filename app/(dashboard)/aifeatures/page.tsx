"use client";

import { useState, useRef } from "react";
import Card from "@/components/Card";
import { aiService } from "@/services/aiService";
import ReactMarkdown from "react-markdown";

export default function AIFeaturesPage() {
  const [period, setPeriod] = useState("");
  const [suggestions, setSuggestions] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestionsSection, setShowSuggestionsSection] = useState(false);
  const [showNewsUnavailable, setShowNewsUnavailable] = useState(false);
  const suggestionsSectionRef = useRef<HTMLDivElement>(null);

  const handleSuggestionsCardClick = () => {
    setShowSuggestionsSection(true);
    setTimeout(() => {
      suggestionsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleNewsCardClick = () => {
    setShowNewsUnavailable(true);
    setTimeout(() => {
      setShowNewsUnavailable(false);
    }, 3000);
  };

  const handleGetSuggestions = async () => {
    if (!period.trim()) {
      setError("Please select a period");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Convert date format (2025-03) to "March 2025"
      const [year, month] = period.split("-");
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const formattedPeriod = `${monthNames[parseInt(month) - 1]} ${year}`;
      
      const response = await aiService.getSuggestions(formattedPeriod);
      
      if (response.success) {
        setSuggestions(response.data.suggestions);
      } else {
        setError("Failed to get AI suggestions");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get suggestions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Features</h1>
          <p className="text-slate-400">
            Get intelligent insights and suggestions for your finances
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* AI Suggestions Card */}
          <div
            onClick={handleSuggestionsCardClick}
            className="relative h-64 rounded-lg overflow-hidden cursor-pointer group transition-transform hover:scale-105"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/suggestion.png')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-purple-900/50 to-transparent group-hover:from-purple-950/95" />
            <div className="relative h-full flex flex-col justify-end p-6">
              <h3 className="text-2xl font-bold text-white mb-2">AI Suggestions</h3>
              <p className="text-purple-100">Get personalized financial insights and recommendations</p>
            </div>
          </div>

          {/* AI News Analysis Card */}
          <div
            onClick={handleNewsCardClick}
            className="relative h-64 rounded-lg overflow-hidden cursor-pointer group transition-transform hover:scale-105"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/ainews.png')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-950/90 via-purple-900/50 to-transparent group-hover:from-purple-950/95" />
            <div className="relative h-full flex flex-col justify-end p-6">
              <h3 className="text-2xl font-bold text-white mb-2">AI News Analysis</h3>
              <p className="text-purple-100">Stay updated with AI-powered financial news analysis</p>
            </div>
          </div>
        </div>

        {/* Unavailable Message */}
        {showNewsUnavailable && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
            <div className="bg-yellow-600 text-white px-6 py-4 rounded-lg shadow-2xl border border-yellow-500">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="font-medium">AI News Analysis is not available yet</p>
              </div>
            </div>
          </div>
        )}

        {/* AI Suggestions Section */}
        {showSuggestionsSection && (
          <div ref={suggestionsSectionRef}>
            <Card title="AI Financial Suggestions">
          <div className="space-y-4">
            <div>
              <label htmlFor="period" className="block text-sm font-medium text-slate-300 mb-2">
                Select Period
              </label>
              <input
                type="month"
                id="period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                Select a month and year to get AI financial suggestions
              </p>
            </div>

            <button
              onClick={handleGetSuggestions}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Getting Suggestions...
                </span>
              ) : (
                "Get AI Suggestions"
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {suggestions && (
              <div className="mt-6 p-6 bg-slate-800 border border-slate-700 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">
                  AI Analysis for {period}
                </h3>
                <div className="prose prose-invert prose-headings:text-blue-400 prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white max-w-none">
                  <ReactMarkdown>{suggestions}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
