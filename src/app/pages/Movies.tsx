import { useState } from "react";
import { MovieManagementTab } from "../components/movie/MovieManagementTab";
import { TrendingMovieTab } from "../components/movie/TrendingMovieTab";
import { Film, Star } from "lucide-react";

export function Movies() {
  const [activeTab, setActiveTab] = useState<
    "movies" | "trending"
  >("movies");

  return (
    <div className="space-y-6">

      {/* Custom Tabs */}
      <div className="inline-flex bg-gray-100 p-1 rounded-2xl">

        <button
          onClick={() => setActiveTab("movies")}
          className={`
            flex items-center gap-2
            px-5 py-2.5
            rounded-xl
            text-sm font-medium
            transition-all
            ${activeTab === "movies"
              ? "bg-white shadow text-violet-600"
              : "text-gray-500 hover:text-gray-900"
            }
          `}
        >
          <Film className="w-4 h-4" />
          Quản lý phim
        </button>

        <button
          onClick={() => setActiveTab("trending")}
          className={`
            flex items-center gap-2
            px-5 py-2.5
            rounded-xl
            text-sm font-medium
            transition-all
            ${activeTab === "trending"
              ? "bg-white shadow text-amber-600"
              : "text-gray-500 hover:text-gray-900"
            }
          `}
        >
          <Star className="w-4 h-4" />
          Phim nổi bật
        </button>

      </div>

      {/* Content */}
      <div>
        {activeTab === "movies" && (
          <MovieManagementTab />
        )}

        {activeTab === "trending" && (
          <TrendingMovieTab />
        )}
      </div>

    </div>
  );
}