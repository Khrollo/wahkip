// Minimalistic mountain peak logo for Blue Mountain Engineering
export default function BlueMountainLogo({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 40 40" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Mountain Peak 1 - Left */}
      <path 
        d="M8 28 L12 16 L16 28 Z" 
        fill="currentColor" 
        className="text-blue-600 dark:text-blue-400"
      />
      
      {/* Mountain Peak 2 - Center (tallest) */}
      <path 
        d="M14 28 L20 8 L26 28 Z" 
        fill="currentColor" 
        className="text-blue-700 dark:text-blue-300"
      />
      
      {/* Mountain Peak 3 - Right */}
      <path 
        d="M24 28 L28 18 L32 28 Z" 
        fill="currentColor" 
        className="text-blue-600 dark:text-blue-400"
      />
      
      {/* Base */}
      <line 
        x1="6" 
        y1="28" 
        x2="34" 
        y2="28" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        className="text-blue-800 dark:text-blue-500"
      />
    </svg>
  );
}


