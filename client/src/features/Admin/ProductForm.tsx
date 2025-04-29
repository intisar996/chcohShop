"use client"

import { Box, Paper, Typography, Grid, Button } from "@mui/material"
import { type FieldValues, useForm } from "react-hook-form"
import AppTextInput from "../../app/components/AppTextInput"
import type { Product } from "../../app/models/product"
import { useEffect } from "react"
import AppDropzone from "../../app/components/AppDropzone"
import { yupResolver } from "@hookform/resolvers/yup"
import { validationSchema } from "./productValidation"
import agent from "../../app/api/agent"
import { LoadingButton } from "@mui/lab"
import { useAppDispatch } from "../../store/configureStore"
import useProducts from "../../hooks/useProducts"
import { setProduct } from "../Product/productSlice"
import AppSelectList from "../../app/components/AppSelectList"
import { toast } from "react-toastify"

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#d1d5db",
    },
    "&:hover fieldset": {
      borderColor: "#ffcd00",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ffcd00",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#4b5563",
    "&.Mui-focused": {
      color: "#ffcd00",
    },
  },
  "& .MuiInputBase-input": {
    color: "#1f2937",
  },
}

const selectStyles = {
  ...inputStyles,
  "& .MuiSvgIcon-root": {
    color: "#4b5563",
  },
}

// Button styles
const cancelButtonStyles = {
  bgcolor: "#f3f4f6",
  color: "#1f2937",
  "&:hover": {
    bgcolor: "#e5e7eb",
  },
  px: 3,
  py: 1,
}

const submitButtonStyles = {
  bgcolor: "#ffcd00",
  color: "#1f2937",
  fontWeight: "bold",
  "&:hover": {
    bgcolor: "#e6b800",
  },
  "&.Mui-disabled": {
    bgcolor: "#fef3c7",
  },
  px: 3,
  py: 1,
}

interface Props {
  product?: Product
  cancelEdit: () => void
}

export default function ProductForm({ product, cancelEdit }: Props) {
  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { isDirty, isSubmitting },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver<any>(validationSchema),
  })
  const { brands, types } = useProducts()
  const watchFile = watch("file", null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (product && !watchFile && !isDirty) reset(product)
    return () => {
      if (watchFile) URL.revokeObjectURL(watchFile.preview)
    }
  }, [product, reset, watchFile, isDirty])

  async function handleSubmitData(data: FieldValues) {
    try {
      let response: Product
      if (product) {
        response = await agent.Admin.updateProduct(data)
        toast.success("Successfuly Updated")
      } else {
        response = await agent.Admin.createProduct(data)
        toast.success("Successfuly Created")

      }
      dispatch(setProduct(response))
      cancelEdit()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", p: 3 }}>
      <Paper
        elevation={2}
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            mb: 4,
            color: "#1f2937",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            borderBottom: "2px solid #ffcd00",
            paddingBottom: 2,
          }}
        >
          Product Details
        </Typography>
        <form onSubmit={handleSubmit(handleSubmitData)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <AppTextInput control={control} name="nameEn" label="Product English name" sx={inputStyles} />
            </Grid>
            <Grid item xs={12} sm={12}>
              <AppTextInput control={control} name="nameAr" label="Product name" sx={inputStyles} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppSelectList items={brands} control={control} name="brand" label="Brand" sx={selectStyles} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppSelectList items={types} control={control} name="type" label="Type" sx={selectStyles} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput  control={control} name="price" label="Price" sx={inputStyles} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput control={control} name="quantityStock" label="Quantity in Stock" sx={inputStyles} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput control={control} name="size" label="Size" sx={inputStyles} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput control={control} name="sugar" label="Sugar Content" sx={inputStyles} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AppTextInput control={control} name="fat" label="Fat Content" sx={inputStyles} />
            </Grid>
            <Grid item xs={12}>
              <AppTextInput
                multiline={true}
                rows={4}
                control={control}
                name="descriptionEn"
                label="English Description"
                sx={inputStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <AppTextInput
                multiline={true}
                rows={4}
                control={control}
                name="descriptionAr"
                label="Arabic Description"
                sx={inputStyles}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px dashed #d1d5db",
                }}
              >
                <AppDropzone
                  control={control}
                  name="file"
                  sx={{
                    "& .MuiPaper-root": {
                      border: "1px dashed #ffcd00",
                      color: "#1f2937",
                    },
                  }}
                />
                {watchFile ? (
                  <Box
                    component="img"
                    src={watchFile.preview}
                    alt="preview"
                    sx={{
                      maxHeight: 200,
                      borderRadius: 2,
                      border: "2px solid #ffcd00",
                    }}
                  />
                ) : (
                  <Box
                    component="img"
                    src={product?.picterUrl}
                    alt={product?.nameEn}
                    sx={{
                      maxHeight: 200,
                      borderRadius: 2,
                      border: product?.picterUrl ? "2px solid #ffcd00" : "none",
                    }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="space-between" sx={{ mt: 4 }}>
            <Button onClick={cancelEdit} variant="contained" sx={cancelButtonStyles}>
              Cancel
            </Button>
            <LoadingButton loading={isSubmitting} type="submit" variant="contained" sx={submitButtonStyles}>
              Submit
            </LoadingButton>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}
