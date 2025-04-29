"use client"

import { useTheme, alpha } from "@mui/material/styles"
import { Card, CardHeader, CardContent, Divider, Box, Typography, LinearProgress } from "@mui/material"
import { ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon } from "@mui/icons-material"

interface TopProduct {
  id: number
  name: string
  sales: number
  revenue: number
  growth: number
}

// Sample data for top products
const topProducts: TopProduct[] = [
  { id: 1, name: "Wireless Headphones", sales: 458, revenue: 13740, growth: 12.5 },
  { id: 2, name: "Smart Watch", sales: 385, revenue: 19250, growth: 8.3 },
  { id: 3, name: "Bluetooth Speaker", sales: 290, revenue: 8700, growth: -2.7 },
  { id: 4, name: "Laptop Stand", sales: 265, revenue: 5300, growth: 15.8 },
]

export default function TopProductsCard() {
  const theme = useTheme()

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title="Top Products" subheader="Best performing products" />
      <Divider />
      <CardContent>
        {topProducts.map((product) => (
          <Box key={product.id} sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body1" fontWeight="medium">
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.sales} sales
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Box sx={{ flexGrow: 1, mr: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, product.sales / 5)}
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 5,
                    },
                  }}
                />
              </Box>
              <Typography variant="body2" fontWeight="bold">
                ${product.revenue.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {product.growth > 0 ? (
                <ArrowUpwardIcon sx={{ color: theme.palette.success.main, fontSize: 16, mr: 0.5 }} />
              ) : (
                <ArrowDownwardIcon sx={{ color: theme.palette.error.main, fontSize: 16, mr: 0.5 }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: product.growth > 0 ? theme.palette.success.main : theme.palette.error.main,
                }}
              >
                {product.growth > 0 ? "+" : ""}
                {product.growth}%
              </Typography>
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  )
}
