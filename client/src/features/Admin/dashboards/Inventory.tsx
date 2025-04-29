"use client"

import type React from "react"

import { useState } from "react"
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
  Button,
  TextField,
  IconButton,
  Chip,
  Pagination,
  Avatar,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import DashboardLayout from "./DashboardLayout"

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

// Sample inventory data
interface InventoryItem {
  id: number
  name: string
  category: string
  price: number
  stock: number
  status: "In Stock" | "Low Stock" | "Out of Stock"
}

const inventoryData: InventoryItem[] = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 89.99, stock: 45, status: "In Stock" },
  { id: 2, name: "Smart Watch", category: "Electronics", price: 199.99, stock: 32, status: "In Stock" },
  { id: 3, name: "Bluetooth Speaker", category: "Electronics", price: 59.99, stock: 8, status: "Low Stock" },
  { id: 4, name: "Laptop Stand", category: "Accessories", price: 29.99, stock: 0, status: "Out of Stock" },
  { id: 5, name: "Wireless Mouse", category: "Accessories", price: 24.99, stock: 56, status: "In Stock" },
  { id: 6, name: "USB-C Hub", category: "Accessories", price: 45.99, stock: 12, status: "In Stock" },
  { id: 7, name: "External SSD", category: "Storage", price: 129.99, stock: 7, status: "Low Stock" },
  { id: 8, name: "Mechanical Keyboard", category: "Accessories", price: 89.99, stock: 23, status: "In Stock" },
  { id: 9, name: "Wireless Earbuds", category: "Electronics", price: 79.99, stock: 0, status: "Out of Stock" },
  { id: 10, name: "Smartphone Case", category: "Accessories", price: 19.99, stock: 67, status: "In Stock" },
  { id: 11, name: "Tablet Stand", category: "Accessories", price: 15.99, stock: 42, status: "In Stock" },
  { id: 12, name: "HDMI Cable", category: "Cables", price: 12.99, stock: 89, status: "In Stock" },
]

export default function Inventory() {
  const theme = useTheme()
  const [page, setPage] = useState(1)
  const [rowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return theme.palette.success.main
      case "Low Stock":
        return theme.palette.warning.main
      case "Out of Stock":
        return theme.palette.error.main
      default:
        return theme.palette.text.secondary
    }
  }

  // Filter inventory based on search term
  const filteredInventory = inventoryData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination
  const paginatedInventory = filteredInventory.slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage)

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  return (
    <DashboardLayout>
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
        <DrawerHeader />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Inventory Management
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Product
          </Button>
        </Box>

        <Card sx={{ mb: 4 }}>
          <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
            <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search products..."
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
        </Card>

        <Card>
          <CardHeader title="Products" subheader={`${filteredInventory.length} items found`} />
          <Divider />
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="inventory table">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedInventory.map((item) => (
                  <TableRow key={item.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={`/placeholder.svg?height=40&width=40`}
                          variant="rounded"
                          sx={{ mr: 2, width: 40, height: 40 }}
                        />
                        <Typography variant="body1">{item.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                    <TableCell align="right">{item.stock}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                          bgcolor: alpha(getStatusColor(item.status), 0.1),
                          color: getStatusColor(item.status),
                          fontWeight: "bold",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" sx={{ mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Pagination
              count={Math.ceil(filteredInventory.length / rowsPerPage)}
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
