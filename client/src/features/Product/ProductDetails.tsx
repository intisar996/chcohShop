/* eslint-disable @typescript-eslint/no-unused-expressions */
import Grid from '@mui/material/Grid2';
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Divider, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material';
import NotFound from '../../app/errors/NotFound';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '../../store/configureStore';
import {addBasketItemAsync, removeBasketItemAsync } from '../Basket/BasketSlice';
import { fetchProductAsync, productSelectors } from './productSlice';
import { useTranslation } from "react-i18next";

export default function ProductDetails() {
    const { i18n } = useTranslation();

    const { basket, status } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();


    const { id } = useParams<{ id: string }>();

    const product = useAppSelector(state => productSelectors.selectById(state, Number(id)));

    const { status: productStatus} = useAppSelector(state => state.product);

    const [quantity, setQuantity] = useState(0);

    // Get Product Id From BasketItems to add Quantity
    const item = basket?.items.find(i => i.productId === product?.id);








    
    useEffect(() => {

        // To Get Quantity For Product From User BasketItem
        if (item) setQuantity(item.quantity);

        // Get Product Info

        if (!product) dispatch(fetchProductAsync(Number(id)));

              
    }, [dispatch, id, item, product])


    // Update Card 
    function handelUpdateCart() {
        if (!product) return;
        // check if have item
        if (!item || quantity > item.quantity) {

            const updatedQuantity = item ? quantity - item.quantity : quantity;
            dispatch(addBasketItemAsync({productId:product.id!, quantity: updatedQuantity }))
        } else {

            const updatedQuantity = item.quantity - quantity;
            dispatch(removeBasketItemAsync({ productId: product.id!, quantity: updatedQuantity })) 
        }


    }


    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        // To Change Input Value

        if (parseInt(event.currentTarget.value) >= 0 && parseInt(event.currentTarget.value) <= product.quantityStock ) {
            
            setQuantity(parseInt(event.currentTarget.value));
        }

    }



    if (productStatus.includes('pending')) return <LoadingComponent message='loading ...' />

    if(!product) return <NotFound />

    return (

        <>
            <Grid container spacing={2} sx={{py:10} }>
                <Grid size={{xs:12,sm:12,md:4}}>
                    <Box>
                        <img src={product.picterUrl} alt={product.nameEn} style={{ width: '100%' }} />
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 8 }} sx={{ px: { xs: 5, sm: 5 } }}>
                    <Box>
                        <Typography variant='h4' color='#192230'>{product.nameEn}</Typography>
                        <Divider sx={{ mt: 4,mb:4 }}>
                        </Divider>
                        <Typography variant='body1' color='#3d474e' fontWeight='700'>OMR {(product.price / 100).toFixed(2)}</Typography>
                        <TableContainer>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>
                                            {i18n.language === "ar" ? product.nameAr : product.nameEn}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Description</TableCell>
                                        <TableCell>{i18n.language === "ar"  ?  product.descriptionAr :  product.descriptionEn}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Type</TableCell>
                                        <TableCell>{product.type}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Brand</TableCell>
                                        <TableCell>{product.brand}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Stock</TableCell>
                                        <TableCell>{product.quantityStock}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Grid container spacing={2}>
                            <Grid>
                                <TextField
                                    onChange={handleInputChange }
                                    variant="outlined"
                                    type="number"
                                    label="Quantity in Cart"
                                    fullWidth
                                    value={quantity}

                                />
                            </Grid>
                            <Grid>
                                <LoadingButton
                                    disabled={item?.quantity === quantity || !item && quantity == 0}
                                    loading={status.includes('pending')}
                                    onClick={handelUpdateCart}
                                    sx={{ height: '55px' }}
                                    color='primary'
                                    size='large'
                                    variant='contained'
                                    fullWidth
                                    style={{ backgroundColor: '#192230' }}

                                >
                                    {item ? 'Update Quantity' : 'Add To Cart' }
                                </LoadingButton>
                            </Grid>


                        </Grid>
                    </Box>
                </Grid>

            </Grid>
        </>
    )
}