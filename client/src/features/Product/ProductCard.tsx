"use client"
import { Card, CardMedia, CardContent, CardActions, Typography, Button, Chip, Box } from "@mui/material"
import { ShoppingCart } from "@mui/icons-material"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "../../store/configureStore"
import { addBasketItemAsync } from "../Basket/BasketSlice"

// Custom color scheme
const colors = {
    main: "#192230",
    second: "#3d474e",
    third: "#ffcd00",
    fourth: "#2c2f38",
}

interface Product {
    id: number
    nameEn: string
    nameAr: string
    price: number
    picterUrl: string
    brand: string
    type: string
    typeName:string
}

interface Props {
    product: Product
}

export default function ProductCard({ product }: Props) {
    const { status } = useAppSelector((state) => state.basket)
    const dispatch = useAppDispatch()
    const { i18n } = useTranslation()
    const isLoading = status.includes("pendingAddItem" + product.id)

    return (
        <Card
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s",
                "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-4px)",
                },
                borderRadius: 2,
                bgcolor: "white",
                border: `1px solid ${colors.second}15`,
            }}
        >
            <Box sx={{ position: "relative" }}>
                <CardMedia
                    component={Link}
                    to={`/product/${product.id}`}
                    sx={{
                        height: 200,
                        backgroundSize: "contain",
                        transition: "transform 0.3s",
                        "&:hover": {
                            transform: "scale(1.05)",
                        },
                    }}
                    image={product.picterUrl || "/placeholder.svg"}
                    title={product.nameEn}
                />
                <Chip
                    label={product.brand}
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        fontWeight: 500,
                        bgcolor: colors.third,
                        color: colors.main,
                    }}
                />
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: "flex-start" }}>
                    <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                            fontWeight: 500,
                            fontSize: "1rem",
                            lineHeight: 1.2,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            height: "2.4em",
                            color: colors.second,
                        }}
                    >
                        {i18n.language === "ar" ? product.nameAr : product.nameEn}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: "bold",
                            ml: 1,
                            whiteSpace: "nowrap",
                            color: colors.third,
                        }}
                    >
                        {product.price.toFixed(2)} .OR
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: colors.second }}>
                    {product.brand} / {product.typeName}
                </Typography>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCart />}
                    onClick={() => dispatch(addBasketItemAsync({ productId: product.id }))}
                    disabled={isLoading}
                    sx={{
                        borderRadius: 1.5,
                        textTransform: "none",
                        fontWeight: 500,
                        bgcolor: colors.third,
                        color: colors.main,
                        "&:hover": {
                            bgcolor: colors.third + "cc",
                        },
                    }}
                >
                    {isLoading ? "Adding..." : "Add to Cart"}
                </Button>
            </CardActions>
        </Card>
    )
}
