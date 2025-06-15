import './App.css';
import { Header } from './components/header';
import TestConnection from './components/testconnection';
import { useState } from 'react';
import { DatePicker } from './components/datepicker';
import MultiLineGraph from './components/multilinegraph';
import Histogram from './components/histogram';

const BASE_URL = 'https://super-duper-space-couscous-wr47wj9r6xg3vxx-8000.app.github.dev';

const formatDateTime = (date) => {
  if (!date) return '';
  const pad = (n) => (n < 10 ? '0' + n : n);
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    ' ' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds())
  );
};

export default function App() {
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [crypto, setCrypto] = useState('eth');
  const [loading, setLoading] = useState(false);
  const [dataSources, setDataSources] = useState({});

  const handleFetch = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To date-times.");
      return;
    }

    setLoading(true);

    try {
      const from_time = formatDateTime(fromDate);
      const to_time = formatDateTime(toDate);
      const interval_hours = [1, 3, 6, 12]; // your intervals

      // Convert array to comma-separated string
      const intervalStr = interval_hours.join(',');

      const params = new URLSearchParams({
        from_time,
        to_time,
        interval_hours: intervalStr,
        crypto: crypto.toLowerCase(),
      });

      const response = await fetch(`${BASE_URL}/api/backfill/?${params.toString()}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + (errorData.error || "Failed to fetch data"));
        setLoading(false);
        return;
      }

      const data = await response.json();
      setDataSources(data);

    } catch (error) {
      alert("Fetch failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative flex flex-col items-center'>

      {/* Spinner Overlay */}
      {loading && (
        <div className="absolute z-50 inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-xl font-semibold">
          <svg className="animate-spin h-12 w-12 mb-4 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Fetching data. Please be patient...
        </div>
      )}

      <Header className="text-black font-extrabold">DASHBOARD</Header>
      <TestConnection />

      <div className="flex items-center my-8 space-x-8">
        <div>
          <h3 className="mb-1">From</h3>
          <DatePicker onSelect={setFromDate} />
        </div>
        <div>
          <h3 className="mb-1">To</h3>
          <DatePicker onSelect={setToDate} />
        </div>
        <div>
          <h3 className="mb-1">Crypto</h3>
          <select
            className="border border-gray-300 rounded px-4 py-2"
            value={crypto}
            onChange={(e) => setCrypto(e.target.value)}
          >
            <option value="eth">ETH</option>
            <option value="btc">BTC</option>
          </select>
        </div>
        <div>
          <h3 className="mb-1 text-white">...</h3>
          <button
            onClick={handleFetch}
            className="border border-gray-300 rounded px-4 py-2 bg-blue-500 text-white"
          >
            Fetch
          </button>
        </div>
      </div>

      {/* Render graph if data is available */}
        <MultiLineGraph
          datetime_from={formatDateTime(fromDate)}
          datetime_to={formatDateTime(toDate)}
          dataSources={dataSources}
          height={400}
        />

        <Histogram 
          datetime_from={formatDateTime(fromDate)}
          datetime_to={formatDateTime(toDate)}
          dataSources={dataSources}
          height={400}
        />
    </div>
  );
}
