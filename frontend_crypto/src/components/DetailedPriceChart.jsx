"use client"

import { useEffect, useRef, useState } from "react"
import Chart from "chart.js/auto"

export default function DetailedPriceChart({ data, coinId }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const [timeframe, setTimeframe] = useState("7d")

  useEffect(() => {
    if (data && data.length > 0) {
      const ctx = chartRef.current.getContext("2d")


      if (chartInstance.current) {
        chartInstance.current.destroy()
      }


      let filteredData = data
      if (timeframe === "1d") {
        filteredData = data.slice(-24)
      } else if (timeframe === "7d") {
        filteredData = data.slice(-168)
      } else if (timeframe === "30d") {
        filteredData = data.slice(-720)
      } else if (timeframe === "90d") {
        filteredData = data.slice(-2160)
      }

      const labels = filteredData.map((item) => {
        const date = new Date(item[0])
        if (timeframe === "1d") {
          return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        } else {
          return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        }
      })

      const prices = filteredData.map((item) => item[1])


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
              label: "Price",
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
                maxTicksLimit: 8,
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
  }, [data, timeframe, coinId])

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe)
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Price Chart</h3>
        <div className="timeframe-buttons">
          <button
            className={`btn btn-sm ${timeframe === "1d" ? "btn-primary" : "btn-outline"}`}
            onClick={() => handleTimeframeChange("1d")}
          >
            1D
          </button>
          <button
            className={`btn btn-sm ${timeframe === "7d" ? "btn-primary" : "btn-outline"}`}
            onClick={() => handleTimeframeChange("7d")}
          >
            7D
          </button>
          <button
            className={`btn btn-sm ${timeframe === "30d" ? "btn-primary" : "btn-outline"}`}
            onClick={() => handleTimeframeChange("30d")}
          >
            30D
          </button>
          <button
            className={`btn btn-sm ${timeframe === "90d" ? "btn-primary" : "btn-outline"}`}
            onClick={() => handleTimeframeChange("90d")}
          >
            90D
          </button>
        </div>
      </div>
      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  )
}

