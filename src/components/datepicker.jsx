import { useState } from 'react';
import { format, setHours, setMinutes } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { CalendarIcon } from 'lucide-react';

export function DatePicker({ onSelect, className = '' }) {
  const [selectedDate, setSelectedDate] = useState();
  const [selectedHour, setSelectedHour] = useState(12);
  const [finalDateTime, setFinalDateTime] = useState();
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (date) => {
    if (!date) return;
    setSelectedDate(date);
  };

  const handleHourChange = (e) => {
    setSelectedHour(parseInt(e.target.value));
  };

  const handleConfirmDateTime = () => {
    if (!selectedDate) return;
    const dateTime = setHours(setMinutes(selectedDate, 0), selectedHour);
    setFinalDateTime(dateTime);
    setShowPicker(false);
    onSelect?.(dateTime);
  };

  const displayValue = finalDateTime
    ? format(finalDateTime, 'PPP p')
    : 'Pick date & hour';

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-lg shadow hover:border-blue-400 transition"
        onClick={() => setShowPicker(!showPicker)}
      >
        <CalendarIcon className="w-5 h-5 text-gray-500" />
        <span className="text-gray-700">{displayValue}</span>
      </button>

      {showPicker && (
        <div className="absolute z-50 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg p-4 w-72">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            modifiersClassNames={{
              selected: 'bg-blue-500 text-white',
              today: 'text-blue-600 font-bold',
            }}
          />
          <div className="mt-4 flex items-center gap-2">
            <label className="text-sm text-gray-700">Hour:</label>
            <select
              value={selectedHour}
              onChange={handleHourChange}
              className="border border-gray-300 rounded px-2 py-1"
            >
              {[...Array(24).keys()].map((h) => (
                <option key={h} value={h}>
                  {h.toString().padStart(2, '0')}:00
                </option>
              ))}
            </select>
            <button
              onClick={handleConfirmDateTime}
              disabled={!selectedDate}
              className="ml-auto px-3 py-1 bg-blue-500 text-white font-xs rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Select
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
