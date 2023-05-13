import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import Chart from 'chart.js/auto';
import './style.css';

const WordFrequencyChart = () => {
  const [data, setData] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const fetchData = async () => {
    try {
      const response = await fetch('https://www.terriblytinytales.com/test.txt');
      const text = await response.text();
      const words = text.split(/\s+/);
      const wordCount = {};
      for (const word of words) {
        if (word in wordCount) {
          wordCount[word] += 1;
        } else {
          wordCount[word] = 1;
        }
      }
      const sortedWordCount = Object.entries(wordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);
      const chartData = {
        labels: sortedWordCount.map(([word, count]) => word),
        datasets: [
          {
            label: 'Word frequency',
            data: sortedWordCount.map(([word, count]) => count),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
          },
        ],
      };
      setData(chartData);
      const csv = Papa.unparse(sortedWordCount);
      setCsvData(csv);
    } catch (error) {
      console.error(error);
    }
  };

  const handleExport = () => {
    if (csvData) {
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'word-frequencies.csv');
    }
  };

  useEffect(() => {
    if (data) {
      const ctx = canvasRef.current.getContext('2d');
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Frequency',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Words',
              },
            },
          },
        },
      });
    }
  }, [data]);

  return (
    <div className="container">
      <h1>Word Frequency Counter</h1>
      <p>Enter text in the input field and click submit to generate a chart showing the frequency of the 20 most common words.</p>
      <div className="input-container">
        <input type="text" placeholder="Enter
 text" />
        <button onClick={fetchData}>Submit</button>
      </div>
      {data && (
        <div className="chart-container">
          <canvas ref={canvasRef} className="chart-canvas"></canvas>
          <button onClick={handleExport}>Export</button>
        </div>
      )}
    </div>
  );

};
export default WordFrequencyChart;