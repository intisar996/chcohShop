
import { Edit, Delete } from "@mui/icons-material"
import {
    Box,
    Typography,
    Button,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    alpha,
} from "@mui/material"
import { currencyFormat } from "../../app/utill/utill"
import AppPagination from "../../app/components/AppPagination"
import { useState } from "react"
import ProductForm from "./ProductForm"
import type { Product } from "../../app/models/product"
import agent from "../../app/api/agent"
import { LoadingButton } from "@mui/lab"
import useProducts from "../../hooks/useProducts"
import { useAppDispatch } from "../../store/configureStore"
import { removeProduct, setPageNumber } from "../Product/productSlice"

export default function Inventory() {
    const { products, metaData } = useProducts()
    const [editMode, setEditMode] = useState(false)
    const dispatch = useAppDispatch()
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined)
    const [loading, setLoading] = useState(false)
    const [target, setTarget] = useState(0)

    function handleSelectProduct(product: Product) {
        setSelectedProduct(product)
        setEditMode(true)
    }

    function cancelEdit() {
        if (selectedProduct) setSelectedProduct(undefined)
        setEditMode(false)
    }

    function handleDeleteProduct(id: number) {
        setLoading(true)
        setTarget(id)
        agent.Admin.deleteProduct(id)
            .then(() => dispatch(removeProduct(id)))
            .catch((error) => console.log(error))
            .finally(() => setLoading(false))
    }

    if (editMode) return <ProductForm cancelEdit={cancelEdit} product={selectedProduct} />

    return (
        <Box sx={{minHeight: "100vh", p: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography
                    sx={{
                        color: "#192230",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                    }}
                    variant="h4"
                >
                    Inventory
                </Typography>
                <Button
                    size="large"
                    variant="contained"
                    onClick={() => setEditMode(true)}
                    sx={{
                        bgcolor: "#ffcd00",
                        color: "#192230",
                        fontWeight: "bold",
                        "&:hover": {
                            bgcolor: alpha("#ffcd00", 0.8),
                        },
                        px: 3,
                        py: 1,
                    }}
                >
                    Create
                </Button>
            </Box>
            <TableContainer
                component={Paper}
                sx={{
                    bgcolor: "#2c2f38",
                    borderRadius: 2,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    overflow: "hidden",
                }}
            >
                <Table sx={{ minWidth: 650 }} aria-label="inventory table">
                    <TableHead>
                        <TableRow sx={{ bgcolor: "#3d474e" }}>
                            <TableCell sx={{ color: "#ffffff", fontWeight: "bold", py: 2 }}>#</TableCell>
                            <TableCell align="left" sx={{ color: "#ffffff", fontWeight: "bold", py: 2 }}>
                                Product
                            </TableCell>
                            <TableCell align="right" sx={{ color: "#ffffff", fontWeight: "bold", py: 2 }}>
                                Price
                            </TableCell>
                            <TableCell align="center" sx={{ color: "#ffffff", fontWeight: "bold", py: 2 }}>
                                Type
                            </TableCell>
                            <TableCell align="center" sx={{ color: "#ffffff", fontWeight: "bold", py: 2 }}>
                                Brand
                            </TableCell>
                            <TableCell align="center" sx={{ color: "#ffffff", fontWeight: "bold", py: 2 }}>
                                Quantity
                            </TableCell>
                            <TableCell align="right" sx={{ color: "#ffffff", fontWeight: "bold", py: 2 }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow
                                key={product.id}
                                sx={{
                                    "&:last-child td, &:last-child th": { border: 0 },
                                    "&:nth-of-type(odd)": { bgcolor: alpha("#3d474e", 0.3) },
                                    "&:hover": { bgcolor: alpha("#3d474e", 0.5) },
                                    transition: "background-color 0.2s ease",
                                }}
                            >
                                <TableCell component="th" scope="row" sx={{ color: "#ffffff", borderColor: alpha("#ffffff", 0.1) }}>
                                    {product.id}
                                </TableCell>
                                <TableCell align="left" sx={{ color: "#ffffff", borderColor: alpha("#ffffff", 0.1) }}>
                                    <Box display="flex" alignItems="center">
                                        <Box
                                            component="img"
                                            src={product.picterUrl}
                                            alt={product.nameEn}
                                            sx={{
                                                height: 50,
                                                width: 50,
                                                objectFit: "cover",
                                                borderRadius: 1,
                                                mr: 2,
                                                border: `2px solid ${alpha("#ffcd00", 0.7)}`,
                                            }}
                                        />
                                        <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                                            {product.nameEn}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{ color: "#ffcd00", fontWeight: "bold", borderColor: alpha("#ffffff", 0.1) }}
                                >
                                    {currencyFormat(product.price)}
                                </TableCell>
                                <TableCell align="center" sx={{ color: "#ffffff", borderColor: alpha("#ffffff", 0.1) }}>
                                    <Box
                                        sx={{
                                            display: "inline-block",
                                            bgcolor: alpha("#ffcd00", 0.2),
                                            color: "#ffcd00",
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 1,
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        {product.type}
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ color: "#ffffff", borderColor: alpha("#ffffff", 0.1) }}>
                                    {product.brand}
                                </TableCell>
                                <TableCell align="center" sx={{ color: "#ffffff", borderColor: alpha("#ffffff", 0.1) }}>
                                    <Box
                                        sx={{
                                            display: "inline-block",
                                            bgcolor: product.quantityStock > 10 ? alpha("#4caf50", 0.2) : alpha("#f44336", 0.2),
                                            color: product.quantityStock > 10 ? "#4caf50" : "#f44336",
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 1,
                                            fontSize: "0.85rem",
                                            minWidth: "40px",
                                        }}
                                    >
                                        {product.quantityStock}
                                    </Box>
                                </TableCell>
                                <TableCell align="right" sx={{ borderColor: alpha("#ffffff", 0.1) }}>
                                    <Button
                                        startIcon={<Edit />}
                                        onClick={() => handleSelectProduct(product)}
                                        sx={{
                                            color: alpha("#ffffff", 0.9),
                                            "&:hover": {
                                                bgcolor: alpha("#3d474e", 0.8),
                                                color: "#ffcd00",
                                            },
                                        }}
                                    />
                                    <LoadingButton
                                        loading={loading && target === product.id}
                                        startIcon={<Delete />}
                                        color="error"
                                        onClick={() => handleDeleteProduct(product.id)}
                                        sx={{
                                            "&.MuiLoadingButton-root": {
                                                "&:hover": {
                                                    bgcolor: alpha("#f44336", 0.1),
                                                },
                                            },
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {metaData && (
                <Box sx={{ pt: 3, display: "flex", justifyContent: "center" }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 1,
                            bgcolor: "#2c2f38",
                            borderRadius: 2,
                            "& .MuiPaginationItem-root": {
                                color: "#ffffff",
                                "&.Mui-selected": {
                                    bgcolor: "#ffcd00",
                                    color: "#192230",
                                    fontWeight: "bold",
                                    "&:hover": {
                                        bgcolor: alpha("#ffcd00", 0.8),
                                    },
                                },
                                "&:hover": {
                                    bgcolor: alpha("#3d474e", 0.8),
                                },
                            },
                        }}
                    >
                        <AppPagination
                            metaData={metaData}
                            onPageChange={(page: number) => dispatch(setPageNumber({ pageNumber: page }))}
                        />
                    </Paper>
                </Box>
            )}
        </Box>
    )
}
