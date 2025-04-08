"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

export default function MarketShareChart({ data }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (data && data.length > 0) {
      const ctx = chartRef.current.getContext("2d")

      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const labels = data.map((item) => item.name)
      const marketCaps = data.map((item) => item.market_cap)

      const colors = [
        "#2563eb",
        "#f59e0b",
        "#10b981",
        "#ef4444",
        "#8b5cf6",
        "#ec4899",
        "#06b6d4",
        "#f97316",
        "#14b8a6",
        "#6366f1",
      ]

      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [
            {
              data: marketCaps,
              backgroundColor: colors.slice(0, data.length),
              borderColor: "#ffffff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
              labels: {
                boxWidth: 15,
                padding: 15,
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.raw
                  let formattedValue

                  if (value >= 1e12) {
                    formattedValue = `$${(value / 1e12).toFixed(2)}T`
                  } else if (value >= 1e9) {
                    formattedValue = `$${(value / 1e9).toFixed(2)}B`
                  } else if (value >= 1e6) {
                    formattedValue = `$${(value / 1e6).toFixed(2)}M`
                  } else {
                    formattedValue = `$${value.toFixed(2)}`
                  }

                  return `${context.label}: ${formattedValue}`
                },
              },
            },
          },
          cutout: "70%",
        },
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

