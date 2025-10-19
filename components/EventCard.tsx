"use client";
export default function EventCard({ e }: { e: any }) {
  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      music: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      food: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
      culture: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      wellness: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      sports: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      nightlife: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
      family: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
      art: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    };
    return colors[tag.toLowerCase()] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  };

  const getCapacityColor = (capacity: string) => {
    const colors: Record<string, string> = {
      low: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    };
    return colors[capacity] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  };

  const getCapacityEmoji = (capacity: string) => {
    const emojis: Record<string, string> = {
      low: "🟢",
      medium: "🟡",
      high: "🔴",
    };
    return emojis[capacity] || "⚪";
  };

  return (
    <div className="bg-white dark:bg-black rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-yellow-200 dark:border-yellow-900">
      {/* Image */}
      <div className="aspect-video bg-gradient-to-br from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-16 h-16 text-white/20 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
        {/* Capacity Badge */}
        {e.capacity && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/95 dark:bg-black/95 backdrop-blur-sm px-2 py-1 rounded-full border border-yellow-300 dark:border-yellow-800">
            <span className="text-xs">{getCapacityEmoji(e.capacity)}</span>
            <span className={`text-xs font-medium capitalize ${getCapacityColor(e.capacity)}`}>
              {e.capacity}
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
          {e.title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span>{new Date(e.date_start).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>{new Date(e.date_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {(e.tags || []).slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className={`text-xs px-2 py-1 rounded-full font-medium ${getTagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

