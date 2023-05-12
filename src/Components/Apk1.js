import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import Chart from 'chart.js/auto';

const Apk1 = () => {
    const [data, setData] = useState(null);
    const canvasRef = useRef(null);

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
            const sortedWordCount = Object.entries(wordCount).sort((a, b) => b[1] - a[1]).slice(0, 20);
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
        } catch (error) {
            console.error(error);
        }
    };

    const handleExport = () => {
        const csvData = Papa.unparse(data);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'word-frequencies.csv');
    };

    useEffect(() => {
        if (data) {
            const ctx = canvasRef.current.getContext('2d');
            new Chart(ctx, {
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
        <div>
            <button onClick={fetchData}>Submit</button>
            {data && (
                <div>
                    <canvas ref={canvasRef} width="400" height="400"></canvas>
                    <button onClick={handleExport}>Export</button>
                </div>
            )}
        </div>
    );
};

export default Apk1;
