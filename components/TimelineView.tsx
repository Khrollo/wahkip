"use client";

type Slot = {
  time: string;
  label: string;
  activities: string[];
};

export default function TimelineView({ itinerary }: { itinerary: any }) {
  const slots: Slot[] = [
    { time: "09:00", label: "Morning", activities: itinerary.morning || [] },
    { time: "12:00", label: "Midday", activities: itinerary.midday || [] },
    { time: "15:00", label: "Afternoon", activities: itinerary.afternoon || [] },
    { time: "19:00", label: "Evening", activities: itinerary.evening || [] },
  ];

  return (
    <div className="space-y-6">
      {slots.map((slot) => (
        <div key={slot.time} className="flex gap-4">
          <div className="w-20 flex-shrink-0 text-right">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{slot.time}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{slot.label}</div>
          </div>
          <div className="flex-1 border-l-4 border-yellow-500 dark:border-yellow-600 pl-6 pb-6">
            {slot.activities.length > 0 ? (
              <ul className="space-y-2">
                {slot.activities.map((activity, idx) => (
                  <li key={idx} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-gray-900 dark:text-gray-100">
                    {activity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 dark:text-gray-600 italic">No activities planned</p>
            )}
          </div>
        </div>
      ))}
      
      {itinerary.transportNotes && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">🚗 Transport Notes</h3>
          <p className="text-blue-800">{itinerary.transportNotes}</p>
        </div>
      )}
      
      {itinerary.costEstimate && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">💰 Estimated Cost</h3>
          <p className="text-green-800 text-lg">{itinerary.costEstimate}</p>
        </div>
      )}
    </div>
  );
}

