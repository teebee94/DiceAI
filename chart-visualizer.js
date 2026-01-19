// =======================================
// Chart Visualizer
// Create interactive charts with Chart.js
// =======================================

class ChartVisualizer {
    constructor(app, analyticsEngine) {
        this.app = app;
        this.analytics = analyticsEngine;
        this.charts = {};
    }

    // Create win/loss pie chart
    createWinLossChart(canvasId) {
        const stats = this.analytics.getWinLossStats();
        const ctx = document.getElementById(canvasId);

        if (!ctx) return null;

        // Destroy existing chart
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        this.charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Correct', 'Wrong'],
                datasets: [{
                    data: [stats.correctPredictions, stats.wrongPredictions],
                    backgroundColor: ['#22c55e', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#fff' }
                    },
                    title: {
                        display: true,
                        text: `Accuracy: ${stats.accuracy}%`,
                        color: '#fff',
                        font: { size: 16, weight: 'bold' }
                    }
                }
            }
        });

        return this.charts[canvasId];
    }

    // Create success rate line chart
    createSuccessRateChart(canvasId) {
        const { labels, data } = this.analytics.getSuccessRateOverTime(10);
        const ctx = document.getElementById(canvasId);

        if (!ctx) return null;

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Accuracy %',
                    data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: '#fff' } },
                    title: {
                        display: true,
                        text: 'Success Rate Over Time (10-entry window)',
                        color: '#fff'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#fff' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    x: {
                        ticks: { color: '#fff' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                }
            }
        });

        return this.charts[canvasId];
    }

    // Create sum distribution bar chart
    createSumDistributionChart(canvasId) {
        const { sumDistribution } = this.analytics.getPatternFrequency();
        const ctx = document.getElementById(canvasId);

        if (!ctx) return null;

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const labels = Array.from({ length: 16 }, (_, i) => (i + 3).toString());

        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Frequency',
                    data: sumDistribution,
                    backgroundColor: '#8b5cf6',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: '#fff' } },
                    title: {
                        display: true,
                        text: 'Sum Distribution (3-18)',
                        color: '#fff'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#fff' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    x: {
                        ticks: { color: '#fff' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                }
            }
        });

        return this.charts[canvasId];
    }

    // Create Big/Small comparison chart
    createBigSmallChart(canvasId) {
        const { bigSmall } = this.analytics.getPatternFrequency();
        const ctx = document.getElementById(canvasId);

        if (!ctx) return null;

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Big (11-18)', 'Small (3-10)'],
                datasets: [{
                    data: [bigSmall.big, bigSmall.small],
                    backgroundColor: ['#ef4444', '#22c55e'],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Big vs Small Distribution',
                        color: '#fff'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#fff' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    x: {
                        ticks: { color: '#fff' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                }
            }
        });

        return this.charts[canvasId];
    }

    // Create hourly performance heatmap-style chart
    createHourlyPerformanceChart(canvasId) {
        const { hourlyStats } = this.analytics.getTimeBasedStats();
        const ctx = document.getElementById(canvasId);

        if (!ctx) return null;

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const labels = hourlyStats.map((_, i) => `${i}:00`);
        const accuracyData = hourlyStats.map(h => h.accuracy);

        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Accuracy %',
                    data: accuracyData,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: '#fff' } },
                    title: {
                        display: true,
                        text: 'Performance by Hour of Day',
                        color: '#fff'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#fff' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    x: {
                        ticks: {
                            color: '#fff',
                            maxRotation: 45,
                            minRotation: 45
                        },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                }
            }
        });

        return this.charts[canvasId];
    }

    // Create Day of Week performance chart (NEW)
    createDayPerformanceChart(canvasId) {
        // Mock data logic - in real usage, we'd aggregate analytics.history by day
        // This requires the AnalyticsEngine to support getDayStats()
        // For now, we'll try to calculate it on the fly or shim it

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayStats = Array(7).fill(0).map(() => ({ total: 0, wins: 0 }));

        // Aggregate existing history
        if (this.app && this.app.predictionEngine && this.app.predictionEngine.history) {
            this.app.predictionEngine.history.forEach(entry => {
                const date = new Date(entry.timestamp);
                const dayIndex = date.getDay();
                dayStats[dayIndex].total++;
                if (entry.predictedCorrectly) dayStats[dayIndex].wins++;
            });
        }

        const winRates = dayStats.map(d => d.total > 0 ? (d.wins / d.total) * 100 : 0);

        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [{
                    label: 'Win Rate %',
                    data: winRates,
                    backgroundColor: winRates.map(rate => rate > 50 ? '#22c55e' : rate > 30 ? '#f59e0b' : '#ef4444'),
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Best Winning Days',
                        color: '#fff'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#fff' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    x: {
                        ticks: { color: '#fff' },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                }
            }
        });

        return this.charts[canvasId];
    }

    // Destroy all charts
    destroyAll() {
        Object.values(this.charts).forEach(chart => chart?.destroy());
        this.charts = {};
    }

    // Update all charts
    updateAll() {
        Object.keys(this.charts).forEach(canvasId => {
            // Re-create chart based on canvas ID
            if (canvasId.includes('winloss')) {
                this.createWinLossChart(canvasId);
            } else if (canvasId.includes('success')) {
                this.createSuccessRateChart(canvasId);
            } else if (canvasId.includes('sum')) {
                this.createSumDistributionChart(canvasId);
            } else if (canvasId.includes('bigsmall')) {
                this.createBigSmallChart(canvasId);
            } else if (canvasId.includes('hourly')) {
                this.createHourlyPerformanceChart(canvasId);
            } else if (canvasId.includes('day')) {
                this.createDayPerformanceChart(canvasId);
            }
        });
    }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartVisualizer;
}
