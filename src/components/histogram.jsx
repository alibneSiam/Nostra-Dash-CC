import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const colorMap = ['#1f77b4', '#ff7f0e'];

function generateHistogramData(allValues, labels, bins) {
  const flatValues = allValues.flat();
  const min = Math.min(...flatValues);
  const max = Math.max(...flatValues);
  const binWidth = (max - min) / bins;

  const binLabels = Array.from({ length: bins }, (_, i) => {
    const binStart = min + i * binWidth;
    const binEnd = binStart + binWidth;
    return `[${binStart.toFixed(5)}, ${binEnd.toFixed(5)}]`;
  });

  const histData = Array.from({ length: bins }, (_, i) => ({
    bin: binLabels[i],
  }));

  allValues.forEach((values, index) => {
    const label = labels[index];
    values.forEach((v) => {
      const binIndex = Math.min(bins - 1, Math.floor((v - min) / binWidth));
      histData[binIndex][label] = (histData[binIndex][label] || 0) + 1;
    });
  });

  return histData;
}

export default function Histogram({
  dataSources,
  bins = 10,
  widthClass = 'w-3/4',
  heightClass = 'h-[32rem]',
  className = '',
}) {
  const allLabels = Object.keys(dataSources);
  const [label1, setLabel1] = useState(allLabels[0]);
  const [label2, setLabel2] = useState(allLabels[1] || allLabels[0]);
  const [mode, setMode] = useState('apr');
  const [histogramData, setHistogramData] = useState([]);

  useEffect(() => {
    if (!label1 || !label2 || !dataSources[label1] || !dataSources[label2]) return;

    const getValues = (label) => {
      return (dataSources[label][mode] || [])
        .map(entry => Object.values(entry)[0])
        .filter(v => typeof v === 'number' && !isNaN(v));
    };

    const values1 = getValues(label1);
    const values2 = getValues(label2);

    const data = generateHistogramData([values1, values2], [label1, label2], bins);
    setHistogramData(data);
  }, [dataSources, label1, label2, mode, bins]);

  return (
    <div className={`${widthClass} ${heightClass} ${className}`}>
      {/* Controls */}
      <div className="flex gap-4 mb-4 items-center">
        <div>
          <label className="mr-2">First Dataset:</label>
          <select value={label1} onChange={(e) => setLabel1(e.target.value)}>
            {allLabels.map(label => (
              <option key={label} value={label}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-2">Second Dataset:</label>
          <select value={label2} onChange={(e) => setLabel2(e.target.value)}>
            {allLabels.map(label => (
              <option key={label} value={label}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-2">Mode:</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="apr">APR</option>
            <option value="apy">APY</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={histogramData} barCategoryGap={2}>
          <XAxis dataKey="bin" angle={-20} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip />
          <Legend />
          {[label1, label2].map((label, index) => (
            <Bar
              key={index}
              dataKey={label}
              fill={colorMap[index % colorMap.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
