
import type React from "react"

import { useState } from "react"
import { TextField, InputAdornment, IconButton, Box } from "@mui/material"
import { Search, Clear } from "@mui/icons-material"
import { debounce } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../store/configureStore"
import { setProductParams } from "./productSlice"

// Custom color scheme
const colors = {
    main: "#192230",
    second: "#3d474e",
    third: "#ffcd00",
    fourth: "#2c2f38",
}

export default function ProductSearch() {
    const { productParams } = useAppSelector((state) => state.product)
    const dispatch = useAppDispatch()
    const [searchTerm, setSearchTerm] = useState(productParams.searchTerm || "")

    const debouncedSearch = debounce((value: string) => {
        dispatch(setProductParams({ searchTerm: value }))
    }, 1000)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setSearchTerm(value)
        debouncedSearch(value)
    }

    const handleClear = () => {
        setSearchTerm("")
        dispatch(setProductParams({ searchTerm: "" }))
    }

    return (
        <Box sx={{ mb: 3 }}>
            <TextField
                fullWidth
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search sx={{ color: colors.second }} />
                        </InputAdornment>
                    ),
                    endAdornment: searchTerm ? (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="clear search"
                                onClick={handleClear}
                                edge="end"
                                size="small"
                                sx={{ color: colors.second }}
                            >
                                <Clear fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ) : null,
                    sx: {
                        borderRadius: 1.5,
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: `${colors.second}40`,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: `${colors.second}80`,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: colors.third,
                        },
                    },
                }}
                sx={{
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: colors.third,
                    },
                }}
            />
        </Box>
    )
}
