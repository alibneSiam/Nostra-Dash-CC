import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';

const colorMap = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
  '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
];

function generateHistogramData(allValues, bins) {
  const flatValues = allValues.flat();
  const min = Math.min(...flatValues);
  const max = Math.max(...flatValues);
  const binWidth = (max - min) / bins;

  const binLabels = Array.from({ length: bins }, (_, i) => {
    const binStart = min + i * binWidth;
    const binEnd = binStart + binWidth;
    return `[${binStart.toFixed(2)}, ${binEnd.toFixed(2)}]`;
  });

  const histData = Array.from({ length: bins }, (_, i) => ({
    bin: binLabels[i],
  }));

  allValues.forEach((values, index) => {
    const label = `Series ${index + 1}`;
    values.forEach((v) => {
      const binIndex = Math.min(
        bins - 1,
        Math.floor((v - min) / binWidth)
      );
      histData[binIndex][label] = (histData[binIndex][label] || 0) + 1;
    });
  });

  return histData;
}


export default function Histogram({ dataSources, bins, widthClass = 'w-3/4', heightClass = 'h-[32rem]', className = '' }) {
  const [histogramData, setHistogramData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const allColumnValues = [];

      for (const [csvPath, columnName] of dataSources) {
        const response = await fetch(csvPath);
        const text = await response.text();

        const parsed = Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });

        const columnValues = parsed.data
          .map(row => row[columnName])
          .filter(v => typeof v === 'number' && !isNaN(v));

        allColumnValues.push(columnValues);
      }

      const data = generateHistogramData(allColumnValues, bins);
      setHistogramData(data);
    }

    loadData();
  }, [dataSources, bins]);

  return (
    <div className={`${widthClass} ${heightClass} ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={histogramData}>
          <XAxis dataKey="bin" />
          <YAxis />
          <Tooltip />
          <Legend />
          {dataSources.map((_, index) => (
            <Bar
              key={index}
              dataKey={`Series ${index + 1}`}
              fill={colorMap[index % colorMap.length]}
              stackId="a"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
