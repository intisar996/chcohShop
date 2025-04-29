"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useTheme, alpha } from "@mui/material/styles"
import {
  Box,
  Typography,
  Card,
  CardHeader,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  MenuItem,
  IconButton,
  Chip,
  Pagination,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import SearchIcon from "@mui/icons-material/Search"
import FilterListIcon from "@mui/icons-material/FilterList"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { useAppDispatch, useAppSelector } from "../../../store/configureStore"
import { allOrderSelectors, fetchAllOrdersAsync } from "../../orders/OrderSlice"
import DashboardLayout from "./DashboardLayout"

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

// Define order status type
type OrderStatus = "Delivered" | "Pending" | "Cancelled" | "Processing" | "new" | "OnPreparing" | "Shipping"

export default function Orders() {
  const theme = useTheme()
  const [page, setPage] = useState(1)
  const [rowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { allOrdersLoaded } = useAppSelector((state) => state.order)
  const orders = useAppSelector((state) => allOrderSelectors.selectAll(state))
  const dispatch = useAppDispatch()

  // Fetch orders when component mounts
  useEffect(() => {
    if (!allOrdersLoaded) {
      dispatch(fetchAllOrdersAsync())
    }
  }, [dispatch, allOrdersLoaded])

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

  // Filter orders based on search term and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      order.id.toString().includes(searchTerm) ||
      (order.buyerId && order.buyerId.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  // Pagination
  const paginatedOrders = filteredOrders.slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage)

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  return (
    <DashboardLayout>
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
        <DrawerHeader />
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
          Orders Management
        </Typography>

        <Card sx={{ mb: 4 }}>
          <Box sx={{ p: 2, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1, maxWidth: "500px" }}>
              <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search by order ID or customer"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                select
                variant="outlined"
                size="small"
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="OnPreparing">On Preparing</MenuItem>
                <MenuItem value="Shipping">Shipping</MenuItem>
              </TextField>
              <IconButton>
                <FilterListIcon />
              </IconButton>
            </Box>
          </Box>
        </Card>

        <Card>
          <CardHeader title="All Orders" />
          <Divider />
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="orders table">
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <TableRow key={order.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        #{order.id}
                      </TableCell>
                      <TableCell>{order.buyerId || "Guest User"}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell align="right">${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.orderStatus}
                          size="small"
                          sx={{
                            bgcolor: alpha(getStatusColor(order.orderStatus), 0.1),
                            color: getStatusColor(order.orderStatus),
                            fontWeight: "bold",
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small">
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      {allOrdersLoaded ? "No orders found" : "Loading orders..."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Pagination
              count={Math.ceil(filteredOrders.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        </Card>
      </Box>
    </DashboardLayout>
  )
}
