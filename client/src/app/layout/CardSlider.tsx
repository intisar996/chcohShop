"use client"

import { Box, Typography } from "@mui/material"
import ProductCard from "../../features/Product/ProductCard"
import ProductCardSkeleton from "../../features/Product/ProductCardSkeleton"
import { useAppSelector } from "../../store/configureStore"
import type { Product } from "../models/product"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useTheme, useMediaQuery } from "@mui/material"

interface Props {
  products: Product[]
}

export default function CardSlider({ products }: Props) {
  const { productsLoaded } = useAppSelector((state) => state.product)
  const theme = useTheme()
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const isSmall = useMediaQuery(theme.breakpoints.between("sm", "md"))
  const isMedium = useMediaQuery(theme.breakpoints.between("md", "lg"))

  // Determine how many slides to show based on screen size
  const slidesToShow = isExtraSmall ? 1 : isSmall ? 2 : isMedium ? 3 : 4

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1200, // large
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 960, // medium
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600, // small
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // extra small
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom, #2d170b, #573203 100%)",
        position: "relative",
        padding: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <svg className="chobar3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1077 200">
        <g>
          <path
            d="M1077,0 
            C1296,15,1040,30,1048,55 
            C1020,65,1030,45,1000,60 
            C970,75,950,50,920,65 
            C890,80,850,60,820,75 
            C790,90,750,70,720,85 
            C690,100,650,80,620,95 
            C590,110,550,90,520,105 
            C560,120,450,100,420,115 
            C390,130,350,110,320,125 
            C290,140,250,120,220,135 
            C190,150,150,130,120,145 
            C126,160,90,140,20,155 
            L-293,0H1077Z"
          ></path>
        </g>
      </svg>

      <Typography variant="h2" textAlign="center" sx={{ py: 10, color: "#ffcd00" }}>
        Item
      </Typography>

      <Box sx={{ px: { xs: 1, sm: 2, md: 4 } }}>
        <Slider {...settings}>
          {products.map((product) => (
            <Box key={product.id} sx={{ px: 1 }}>
              {!productsLoaded ? <ProductCardSkeleton /> : <ProductCard product={product} />}
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  )
}
