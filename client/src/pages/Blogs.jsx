import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../components/dashboard/DashboardLayout";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const cardVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

// Groq API key from environment variable
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Extract state from location string
const extractState = (location) => {
  if (!location) return "India";
  
  const INDIAN_STATES = {
    "andhra pradesh": "Andhra Pradesh",
    "arunachal pradesh": "Arunachal Pradesh",
    "assam": "Assam",
    "bihar": "Bihar",
    "chhattisgarh": "Chhattisgarh",
    "goa": "Goa",
    "gujarat": "Gujarat",
    "haryana": "Haryana",
    "himachal pradesh": "Himachal Pradesh",
    "jharkhand": "Jharkhand",
    "karnataka": "Karnataka",
    "kerala": "Kerala",
    "madhya pradesh": "Madhya Pradesh",
    "maharashtra": "Maharashtra",
    "manipur": "Manipur",
    "meghalaya": "Meghalaya",
    "mizoram": "Mizoram",
    "nagaland": "Nagaland",
    "odisha": "Odisha",
    "punjab": "Punjab",
    "rajasthan": "Rajasthan",
    "sikkim": "Sikkim",
    "tamil nadu": "Tamil Nadu",
    "telangana": "Telangana",
    "tripura": "Tripura",
    "uttar pradesh": "Uttar Pradesh",
    "uttarakhand": "Uttarakhand",
    "west bengal": "West Bengal",
    "delhi": "Delhi",
  };

  const locationLower = location.toLowerCase();
  for (const [key, value] of Object.entries(INDIAN_STATES)) {
    if (locationLower.includes(key)) {
      return value;
    }
  }
  return "India";
};

// Article categories with icons and colors
const categories = [
  { id: "contamination", label: "Water Contamination News", icon: "warning", color: "red" },
  { id: "conservation", label: "Water Conservation Tips", icon: "eco", color: "green" },
  { id: "health", label: "Health & Safety", icon: "health_and_safety", color: "blue" },
  { id: "technology", label: "Water Tech Innovations", icon: "science", color: "purple" },
];

function Blogs() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userRegion, setUserRegion] = useState("India");

  useEffect(() => {
    // Get user's region
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const region = extractState(user.region);
    setUserRegion(region);
    
    fetchArticles(region);
  }, []);

  const fetchArticles = async (region) => {
    setLoading(true);
    setError(null);

    try {
      const prompt = `You are a water resource and environmental news generator for ${region}, India. Generate 8 realistic news articles and tips about water-related topics.

Return ONLY a valid JSON array (no markdown, no code blocks) with exactly 8 articles in this format:
[
  {
    "id": 1,
    "title": "Article headline (8-12 words)",
    "summary": "Brief summary of the article (25-40 words)",
    "category": "contamination|conservation|health|technology",
    "readTime": "3 min",
    "date": "Mar 5, 2026",
    "source": "News source name",
    "imageKeyword": "water|river|tap|pollution|rain|lake"
  }
]

Requirements:
- 2 articles about water contamination issues or alerts in ${region}
- 2 articles about water conservation and saving tips
- 2 articles about health impacts of water quality
- 2 articles about water technology or innovations
- Make headlines engaging and specific to ${region} when relevant
- Use realistic Indian news sources like Times of India, The Hindu, NDTV, India Today
- Dates should be recent (Feb-Mar 2026)
- imageKeyword should be one word for placeholder image`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1500,
          temperature: 0.8,
        }),
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0]?.message?.content) {
        const content = data.choices[0].message.content.trim();
        try {
          // Remove markdown code blocks if present
          const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
          const parsed = JSON.parse(jsonStr);
          setArticles(parsed);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          setError("Failed to parse articles. Please try again.");
        }
      } else {
        setError("Unable to load articles");
      }
    } catch (err) {
      console.error("Articles fetch failed:", err);
      setError("Failed to load articles. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = selectedCategory === "all" 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  const getCategoryStyle = (category) => {
    const styles = {
      contamination: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      conservation: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      health: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      technology: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    };
    return styles[category] || styles.health;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      contamination: "warning",
      conservation: "eco",
      health: "health_and_safety",
      technology: "science",
    };
    return icons[category] || "article";
  };

  const getImageUrl = (keyword, id) => {
    // Use placeholder images based on keyword
    const imageMap = {
      water: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=250&fit=crop",
      river: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=250&fit=crop",
      tap: "https://images.unsplash.com/photo-1585687433141-bb4f7e4d5178?w=400&h=250&fit=crop",
      pollution: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=250&fit=crop",
      rain: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=400&h=250&fit=crop",
      lake: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=250&fit=crop",
      health: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop",
      technology: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=250&fit=crop",
    };
    return imageMap[keyword] || imageMap.water;
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-500">newspaper</span>
          Water News & Articles
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Stay informed about water quality, conservation tips, and health news in{" "}
          <span className="font-semibold text-blue-500">{userRegion}</span>
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selectedCategory === "all"
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
          }`}
        >
          All Articles
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              selectedCategory === cat.id
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            <span className="material-symbols-outlined text-sm">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </motion.div>

      {/* Refresh Button */}
      <motion.div variants={itemVariants} className="flex justify-end mb-4">
        <button
          onClick={() => fetchArticles(userRegion)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors"
        >
          <span className={`material-symbols-outlined text-sm ${loading ? "animate-spin" : ""}`}>
            refresh
          </span>
          {loading ? "Loading..." : "Refresh Articles"}
        </button>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400">Fetching latest articles for {userRegion}...</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
          <span className="material-symbols-outlined text-4xl text-red-500 mb-2">error</span>
          <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
          <button
            onClick={() => fetchArticles(userRegion)}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Articles Grid - Horizontal Cards */}
      {!loading && !error && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredArticles.length === 0 ? (
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">
                article
              </span>
              <h3 className="text-xl font-bold mb-2">No Articles Found</h3>
              <p className="text-slate-500 dark:text-slate-400">
                No articles in this category. Try selecting a different category.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article, index) => (
                <motion.article
                  key={article.id || index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-64 lg:w-80 flex-shrink-0 relative overflow-hidden">
                      <img
                        src={getImageUrl(article.imageKeyword, article.id)}
                        alt={article.title}
                        className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r"></div>
                      <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${getCategoryStyle(article.category)}`}>
                        <span className="material-symbols-outlined text-xs mr-1 align-middle">
                          {getCategoryIcon(article.category)}
                        </span>
                        {article.category?.charAt(0).toUpperCase() + article.category?.slice(1)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                      <div>
                        <h2 className="text-lg md:text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors line-clamp-2">
                          {article.title}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 md:line-clamp-3">
                          {article.summary}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            {article.readTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            {article.date}
                          </span>
                          <span className="hidden sm:flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">source</span>
                            {article.source}
                          </span>
                        </div>

                        <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-medium group/btn">
                          Read More
                          <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">
                            arrow_forward
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Footer */}
          {filteredArticles.length > 0 && (
            <motion.div variants={itemVariants} className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""}
              {selectedCategory !== "all" && ` in ${selectedCategory}`}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Info Banner */}
      <motion.div variants={itemVariants} className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-blue-500">tips_and_updates</span>
          <div>
            <p className="font-semibold text-blue-700 dark:text-blue-400">AI-Generated Content</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              These articles are generated by AI based on common water quality topics relevant to your region. 
              For official news, please refer to government sources and verified news outlets.
            </p>
          </div>
        </div>
      </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}

export default Blogs;
