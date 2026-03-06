import React, { useState, useEffect } from "react";

// OpenRouter API key
const OPENROUTER_API_KEY = "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";

const RecommendedActions = ({ riskLevel = "moderate", diseases = [], waterTestData = {} }) => {
  const [aiAdvice, setAiAdvice] = useState(null);
  const [loadingAI, setLoadingAI] = useState(true);
  const [error, setError] = useState(null);

  // Fetch AI advice from OpenRouter
  useEffect(() => {
    const fetchAIAdvice = async () => {
      setLoadingAI(true);
      setError(null);
      
      try {
        const diseaseInfo = diseases.length 
          ? diseases.map(d => `${d.name}: ${d.probability}%`).join(", ")
          : "General water quality concerns";
        
        const prompt = `You are a water quality health advisor. Based on water test results showing ${diseaseInfo} with ${riskLevel} overall risk level, provide specific actionable recommendations.

Return ONLY a JSON object (no markdown, no code blocks) in this exact format:
{
  "household": ["action 1", "action 2", "action 3"],
  "publicHealth": ["action 1", "action 2", "action 3"]
}

Rules:
- Each action should be 8-15 words, specific and actionable
- For household: focus on immediate personal/family safety measures
- For publicHealth: focus on community-level interventions
- Tailor severity to ${riskLevel} risk level`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin,
          },
          body: JSON.stringify({
            model: "openai/gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 300,
            temperature: 0.7,
          }),
        });

        const data = await response.json();
        if (data.choices && data.choices[0]?.message?.content) {
          const content = data.choices[0].message.content.trim();
          // Try to parse JSON from response
          try {
            // Remove any markdown code blocks if present
            const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
            const parsed = JSON.parse(jsonStr);
            setAiAdvice(parsed);
          } catch (parseError) {
            // If JSON parsing fails, set raw text as fallback
            console.error("JSON parse error:", parseError);
            setAiAdvice({ raw: content });
          }
        } else {
          setError("Unable to generate recommendations");
        }
      } catch (err) {
        console.error("AI advice fetch failed:", err);
        setError("Failed to load AI recommendations");
      } finally {
        setLoadingAI(false);
      }
    };

    fetchAIAdvice();
  }, [diseases, riskLevel]);

  const riskColors = {
    high: {
      badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      accent: "from-red-500 to-rose-500",
    },
    moderate: {
      badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      accent: "from-amber-500 to-orange-500",
    },
    low: {
      badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      accent: "from-emerald-500 to-teal-500",
    },
  };

  const colors = riskColors[riskLevel] || riskColors.moderate;

  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500">
              smart_toy
            </span>
            AI-Powered Recommendations
          </h2>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${colors.badge}`}>
            {riskLevel} Risk
          </span>
        </div>
        <p className="text-sm text-slate-500">
          Personalized advice based on your water quality analysis
        </p>
      </div>

      {/* Loading State */}
      {loadingAI && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-700"></div>
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
          </div>
          <p className="mt-4 text-sm text-slate-500">Generating personalized recommendations...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loadingAI && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <span className="material-symbols-outlined text-red-500">error</span>
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* AI Advice Content */}
      {!loadingAI && aiAdvice && !error && (
        <div className="space-y-6">
          {/* Check if we have structured data or raw text */}
          {aiAdvice.household && aiAdvice.publicHealth ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Household Actions */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-100 dark:border-blue-800/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                    <span className="material-symbols-outlined">home</span>
                  </div>
                  <h3 className="font-bold text-blue-900 dark:text-blue-100">For Your Household</h3>
                </div>
                <ul className="space-y-3">
                  {aiAdvice.household.map((action, i) => (
                    <li key={i} className="flex gap-3 text-sm text-blue-800 dark:text-blue-200">
                      <span className="material-symbols-outlined text-blue-500 text-lg mt-0.5 flex-shrink-0">
                        check_circle
                      </span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Public Health */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-100 dark:border-emerald-800/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
                    <span className="material-symbols-outlined">local_hospital</span>
                  </div>
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-100">Public Health Response</h3>
                </div>
                <ul className="space-y-3">
                  {aiAdvice.publicHealth.map((action, i) => (
                    <li key={i} className="flex gap-3 text-sm text-emerald-800 dark:text-emerald-200">
                      <span className="material-symbols-outlined text-emerald-500 text-lg mt-0.5 flex-shrink-0">
                        check_circle
                      </span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            /* Raw text fallback */
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900/50 dark:to-blue-950/30 border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {aiAdvice.raw || JSON.stringify(aiAdvice)}
              </p>
            </div>
          )}

          {/* AI Attribution */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="material-symbols-outlined text-slate-400 text-sm">auto_awesome</span>
            <p className="text-xs text-slate-400">
              Generated by AI based on your specific water quality parameters
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default RecommendedActions;
