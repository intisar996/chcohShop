"use client"

import { useEffect, useState } from "react"
import { useTheme, alpha } from "@mui/material/styles"
import { Link } from "react-router-dom"
import {
  Card,
  CardHeader,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Button,
} from "@mui/material"
import { useAppSelector } from "../../../store/configureStore"
import { allOrderSelectors } from "../../orders/OrderSlice"

// Define order status type
type OrderStatus = "Delivered" | "Pending" | "Cancelled" | "Processing" | "new" | "OnPreparing" | "Shipping"

// Sample data for the dashboard
interface RecentOrder {
  id: number
  customer: string
  date: string
  amount: number
  status: OrderStatus
}

export default function RecentOrdersTable() {
  const theme = useTheme()
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])

  const { allOrdersLoaded } = useAppSelector((state) => state.order)
  const orders = useAppSelector((state) => allOrderSelectors.selectAll(state))

  // Process orders data when it's loaded
  useEffect(() => {
    if (allOrdersLoaded && orders.length > 0) {
      // Convert orders to the format needed for the dashboard
      const formattedOrders = orders
        .slice(0, 5) // Get only the 5 most recent orders
        .map((order) => ({
          id: order.id,
          customer: order.buyerId || "Guest User",
          date: new Date(order.orderDate).toLocaleDateString(),
          amount: order.total,
          status: order.orderStatus as OrderStatus,
        }))

      setRecentOrders(formattedOrders)
    }
  }, [allOrdersLoaded, orders])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return theme.palette.success.main
      case "Processing":
      case "OnPreparing":
        return theme.palette.info.main
      case "Pending":
      case "new":
        return theme.palette.warning.main
      case "Cancelled":
        return theme.palette.error.main
      case "Shipping":
        return theme.palette.primary.main
      default:
        return theme.palette.text.secondary
    }
  }

  return (
    <Card>
      <CardHeader
        title="Recent Orders"
        subheader={`Last ${recentOrders.length} orders placed in the system`}
        action={
          <Button component={Link} to="/orders" variant="text" sx={{ color: theme.palette.primary.main }}>
            View All
          </Button>
        }
      />
      <Divider />
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="recent orders table">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <TableRow key={order.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    #{order.id}
                  </TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell align="right">${order.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: alpha(getStatusColor(order.status), 0.1),
                        color: getStatusColor(order.status),
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      {order.status}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {allOrdersLoaded ? "No orders found" : "Loading orders..."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}
