
import { useState } from "react"
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Divider,
    Box,
    useMediaQuery,
    Drawer,
    IconButton,
    Container,
    Paper,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { FilterAlt, Clear } from "@mui/icons-material"

import { useAppDispatch, useAppSelector } from "../../store/configureStore"
import { resetProductParams, setPageNumber, setProductParams } from "./productSlice"
import ProductList from "./ProductList"
import ProductSearch from "./ProductSearch"
import RadioButtonGroup from "../../app/components/RadioButtonGroup"
import CheckboxButtons from "../../app/components/CheckboxButtons"
import AppPagination from "../../app/components/AppPagination"
import LoadingComponent from "../../app/layout/LoadingComponent"
import useProducts from "../../hooks/useProducts"

// Custom color scheme
const colors = {
    main: "#192230",
    second: "#3d474e",
    third: "#ffcd00",
    fourth: "#2c2f38",
}

const sortOptions = [
    { value: "name", lable: "Alphabetical" },
    { value: "priceDesc", lable: "Price - High to low" },
    { value: "price", lable: "Price - Low to High" },
]

export default function Product() {
    const { products, filterLoaded, brands, types, metaData } = useProducts()
    const dispatch = useAppDispatch()
    const { productParams } = useAppSelector((state) => state.product)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))
    const [drawerOpen, setDrawerOpen] = useState(false)

    const handleClearFilters = () => {
        dispatch(resetProductParams())
    }

    if (!filterLoaded) return <LoadingComponent />

    const FilterContent = () => (
        <Box sx={{ p: isMobile ? 2 : 0 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ color: colors.main, fontWeight: 600 }}>
                    Filters
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Clear />}
                    onClick={handleClearFilters}
                    sx={{
                        textTransform: "none",
                        borderColor: colors.third,
                        color: colors.third,
                        "&:hover": {
                            borderColor: colors.third,
                            backgroundColor: `${colors.third}10`,
                        },
                    }}
                >
                    Clear All
                </Button>
            </Box>

            <Divider sx={{ mb: 3, borderColor: `${colors.second}30` }} />

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: colors.second }}>
                    Sort By
                </Typography>
                <RadioButtonGroup
                    title=""
                    selectedValue={productParams.orderBy}
                    options={sortOptions}
                    onChange={(e) => dispatch(setProductParams({ orderBy: e.target.value }))}
                />
            </Box>

            <Divider sx={{ mb: 3, borderColor: `${colors.second}30` }} />

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: colors.second }}>
                    Brands
                </Typography>
                <CheckboxButtons
                    title=""
                    items={brands}
                    checked={productParams.brands}
                    onChange={(items: string[]) => dispatch(setProductParams({ brands: items }))}
                />
            </Box>

            <Divider sx={{ mb: 3, borderColor: `${colors.second}30` }} />

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: colors.second }}>
                    Types
                </Typography>
                <CheckboxButtons
                    title=""
                    items={types}
                    checked={productParams.types}
                    onChange={(items: string[]) => dispatch(setProductParams({ types: items }))}
                />
            </Box>
        </Box>
    )

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: colors.main }}>
                    Products
                </Typography>

                {isMobile && (
                    <Button
                        variant="outlined"
                        startIcon={<FilterAlt />}
                        onClick={() => setDrawerOpen(true)}
                        sx={{
                            textTransform: "none",
                            borderColor: colors.third,
                            color: colors.third,
                            "&:hover": {
                                borderColor: colors.third,
                                backgroundColor: `${colors.third}10`,
                            },
                        }}
                    >
                        Filters
                    </Button>
                )}
            </Box>

            <Grid container spacing={3}>
                {/* Filters for desktop */}
                {!isMobile && (
                    <Grid item md={3}>
                        <Card
                            sx={{
                                borderRadius: 2,
                                bgcolor: "white",
                                boxShadow: 1,
                                border: `1px solid ${colors.second}15`,
                            }}
                        >
                            <CardContent>
                                <FilterContent />
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Mobile drawer for filters */}
                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    PaperProps={{
                        sx: {
                            bgcolor: "white",
                        },
                    }}
                >
                    <Box sx={{ width: 280, maxWidth: "100%" }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                p: 2,
                                bgcolor: colors.main,
                                color: "white",
                            }}
                        >
                            <Typography variant="h6">Filters</Typography>
                            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "white" }}>
                                <Clear />
                            </IconButton>
                        </Box>
                        <Divider />
                        <Box sx={{ p: 2 }}>
                            <FilterContent />
                        </Box>
                    </Box>
                </Drawer>

                {/* Product listing */}
                <Grid item xs={12} md={isMobile ? 12 : 9}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            mb: 3,
                            bgcolor: "white",
                            boxShadow: 1,
                            border: `1px solid ${colors.second}15`,
                        }}
                    >
                        <ProductSearch />
                    </Paper>

                    <ProductList products={products} />

                    {metaData && (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <AppPagination
                                metaData={metaData}
                                onPageChange={(page: number) => dispatch(setPageNumber({ pageNumber: page }))}
                            />
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Container>
    )
}
