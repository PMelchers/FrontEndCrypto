"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

export default function TrendChart({ data, title }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (data && data.length > 0) {
      const ctx = chartRef.current.getContext("2d")

      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const labels = data.map((item) => {
        const date = new Date(item[0])
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      })

      const prices = data.map((item) => item[1])

      const startPrice = prices[0]
      const endPrice = prices[prices.length - 1]
      const isPositive = endPrice >= startPrice

      const gradient = ctx.createLinearGradient(0, 0, 0, 400)
      if (isPositive) {
        gradient.addColorStop(0, "rgba(16, 185, 129, 0.2)")
        gradient.addColorStop(1, "rgba(16, 185, 129, 0)")
      } else {
        gradient.addColorStop(0, "rgba(239, 68, 68, 0.2)")
        gradient.addColorStop(1, "rgba(239, 68, 68, 0)")
      }

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: title || "Price Trend",
              data: prices,
              borderColor: isPositive ? "#10b981" : "#ef4444",
              backgroundColor: gradient,
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 4,
              pointHoverBackgroundColor: isPositive ? "#10b981" : "#ef4444",
              pointHoverBorderColor: "#ffffff",
              pointHoverBorderWidth: 2,
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              mode: "index",
              intersect: false,
              callbacks: {
                label: (context) => `$${context.parsed.y.toFixed(2)}`,
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                maxRotation: 0,
                autoSkip: true,
                maxTicksLimit: 6,
              },
            },
            y: {
              grid: {
                borderDash: [5, 5],
              },
              ticks: {
                callback: (value) => `$${value.toFixed(2)}`,
              },
            },
          },
          interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
          },
        },
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, title])

  return (
    <div className="chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

