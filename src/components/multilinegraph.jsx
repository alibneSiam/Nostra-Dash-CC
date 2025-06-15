import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';
import clsx from 'clsx';

const colorMap = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
  '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
];

export default function MultiLineGraph({
  datetime_from,
  datetime_to,
  dataSources,
  className = '',
  height = 400
}) {
  const [chartData, setChartData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [mode, setMode] = useState('apr'); // 'apr' or 'apy'
  const [minValue, setMinValue] = useState(null);
  const [maxValue, setMaxValue] = useState(null);

  useEffect(() => {
    if (!dataSources || Object.keys(dataSources).length === 0) return;
    if (!datetime_from || !datetime_to) return;

    const start = new Date(datetime_from);
    const end = new Date(datetime_to);

    const datetimeSet = new Set();
    const labelMap = {};

    Object.entries(dataSources).forEach(([sourceKey, data]) => {
      const points = data[mode]; // use apr or apy
      const label = sourceKey;

      labelMap[label] = {};

      points.forEach((entry) => {
        const [datetime, value] = Object.entries(entry)[0];
        const dateObj = new Date(datetime);
        if (dateObj >= start && dateObj <= end) {
          labelMap[label][datetime] = value;
          datetimeSet.add(datetime);
        }
      });
    });

    const sortedDatetimes = Array.from(datetimeSet).sort();

    const combined = sortedDatetimes.map(dt => {
      const point = { datetime: dt };
      for (const label in labelMap) {
        if (labelMap[label][dt] !== undefined) {
          point[label] = labelMap[label][dt];
        }
      }
      return point;
    });

    // Calculate min/max values for Y-axis
    let tempMin = Infinity;
    let tempMax = -Infinity;
    combined.forEach(point => {
      Object.entries(point).forEach(([key, value]) => {
        if (key !== 'datetime' && typeof value === 'number') {
          if (value < tempMin) tempMin = value;
          if (value > tempMax) tempMax = value;
        }
      });
    });

    setChartData(combined);
    setLabels(Object.keys(labelMap));
    setMinValue(tempMin === Infinity ? 0 : tempMin);
    setMaxValue(tempMax === -Infinity ? 1 : tempMax);
  }, [dataSources, datetime_from, datetime_to, mode]);

  return (
    <div className={clsx('w-full flex flex-col items-center', className)} style={{ height }}>
      {/* Toggle */}
      <div className="mb-4 flex gap-4">
        <button
          className={`px-4 py-2 rounded ${mode === 'apr' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setMode('apr')}
        >
          APR
        </button>
        <button
          className={`px-4 py-2 rounded ${mode === 'apy' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setMode('apy')}
        >
          APY
        </button>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="datetime"
            tickFormatter={(dt) => dt.split(' ')[1] || dt}
          />
          <YAxis
            domain={[minValue, maxValue]}
            tickFormatter={(val) => parseFloat(val).toFixed(5)}
          />
          <Tooltip
            formatter={(value) =>
              typeof value === 'number' ? value.toFixed(5) : value
            }
          />
          <Legend />
          {labels.map((label, i) => (
            <Line
              key={label}
              type="monotone"
              dataKey={label}
              stroke={colorMap[i % colorMap.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
