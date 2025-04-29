import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { fetchOrderAsync, orderDetailesSelectors } from "./OrderSlice";
import { useEffect } from "react";
import Grid from '@mui/material/Grid2';
import { Box, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {Inventory, ListAlt, LocalShipping, Payment } from "@mui/icons-material";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";

export default function OrderDetailes() {


    const { t, i18n } = useTranslation();
    const {id } = useParams<{id:string}>();


    const order = useAppSelector(state => orderDetailesSelectors.selectById(state, Number(id)));


    const { status: orderStatus } = useAppSelector(state => state.order);

    const dispatch = useAppDispatch();


    console.log("OrderDetailes", Number(id))


    useEffect(() => {



        if (!order) dispatch(fetchOrderAsync(Number(id)));


    }, [dispatch, id, order])


    if (orderStatus.includes('pending')) return <LoadingComponent message='loading ...' />

    if (!order) return <NotFound />

    return (
        <>
            <Box sx={{ flexGrow: 1}}>

                <Grid container spacing={1} sx={{py:8} }>
                    <Grid size={{ xs: 12, sm: 12, md:8 }} sx={{px:2} } >
                        <Typography variant="h4" sx={{py:2} }>
                            {t('OrderNumber')} <span style={{ color: 'red' }}>#{order.id}</span>
                        </Typography>

                        <Box component={Paper} sx={{py:1,my:2,px:2} }>
                            <Typography variant="h4" sx={{ py: 2 }}>
                                {t('Progress')}
                            </Typography>
                        <Grid container spacing={2} >
                                <Grid size={3}  component={Paper} sx={{ p: 1, display: 'flex', justifyContent: 'center', flexDirection: 'column',gap:0.5 }}>
                                    <ListAlt sx={{color: '#3d474e !important' }} />
                                    <Typography variant="body2" sx={{fontSize:'0.800rem',mb:1} }>
                                        {t('OrderConfirming')}
                                    </Typography>
                                    <LinearProgress variant="determinate" sx={{ borderRadius: 4, backgroundColor:'#3d474e !important'}} value={(order.orderStatus === 'Pending' ? 100 : 50)} />
                            </Grid>
                                <Grid size={3} component={Paper} sx={{ p: 1, display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 0.5 }}>
                                    <Payment sx={{ color: '#3d474e !important' }} />
                                    <Typography variant="body2" sx={{ fontSize: '0.800rem', mb: 1 }}>
                                        {t('PaymentPending')}
                                    </Typography>
                                    <LinearProgress variant="determinate" sx={{ borderRadius: 4, backgroundColor: '#3d474e !important' }} value={(order.orderStatus === 'Pending' ? 100 : 50)} />
                                </Grid>
                                <Grid size={3} component={Paper} sx={{ p: 1, display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 0.5 }}>
                                    <Inventory sx={{ color: '#3d474e !important' }} />
                                    <Typography variant="body2" sx={{ fontSize: '0.800rem', mb: 1 }}>
                                        {t('Shipping')}
                                    </Typography>
                                    <LinearProgress variant="determinate" sx={{ borderRadius: 4, backgroundColor: '#3d474e !important' }} value={(order.orderStatus === 'Pending' ? 100 : 50)} />
                                </Grid>
                                <Grid size={3} component={Paper} sx={{ p: 1, display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 0.5 }}>
                                    <LocalShipping sx={{ color: '#3d474e !important' }} />
                                    <Typography variant="body2" sx={{ fontSize: '0.800rem', mb: 1 }}>
                                        {t('Delivered')}
                                    </Typography>
                                    <LinearProgress variant="determinate" sx={{ borderRadius: 4, backgroundColor: '#3d474e !important' }} value={(order.orderStatus === 'Pending' ? 100 : 50)} />
                                </Grid>

                            </Grid>

                        </Box>


                        <TableContainer component={Paper} sx={{ borderRadius:4 } }>
                            <Table sx={{ minWidth: 650 }} aria-label="caption table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t('ItemsSummary')}</TableCell>
                                        <TableCell align="right">{t('Price')}</TableCell>
                                        <TableCell align="right">{t('Quantity')}</TableCell>
                                        <TableCell align="right">{t('Total')}</TableCell>


                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.orderItems.map((item) => (
                                        <TableRow key={item.productId}>
                                            <TableCell component="th" scope="row">
                                                <Box display='flex' alignItems='center'>
                                                    <img src={item.pictuerUrl} alt={item.nameEn} style={{ height: 50, marginRight: 20 }} />
                                                    <span>{i18n.language === "ar" ? item.nameAr : item.nameEn }</span>
                                                </Box>                                            </TableCell>
                                            <TableCell align="right">{item.price}.Ro</TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                            <TableCell align="right">{item.quantity * item.price}</TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 4 }} columnSpacing={4}  sx={{px:2, borderRadius: 4 }} >
                        <Grid sx={{ p: 2, my: 2, borderRadius: 4 }} component={Paper} >
                            <Typography variant="h5" sx={{ py: 2 }} >
                                {t('Ordersummery') }
                            </Typography>

                            <Box display="flex" justifyContent="space-between" alignItems="center" >
                                <Typography variant="h6" sx={{ py: 2 }} >
                                    {t('OrderDate')}
                                </Typography>
                                <span>{order.orderDate}</span>       
                            </Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" >
                                <Typography variant="h6" sx={{ py: 2 }} >
                                    {t('SubTotal')}
                                </Typography>
                                <span>{order.subtotal}</span>
                            </Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" >
                                <Typography variant="h6" sx={{ py: 2 }} >
                                    {t('Delivery fee') }
                                </Typography>
                                <span>{order.deliveryFee}</span>
                            </Box>
                        </Grid>

                        <Grid sx={{ p: 2, my: 2, borderRadius: 4 }} component={Paper }>
                            <Box display="flex" justifyContent="space-between" alignItems="center" >
                                <Typography variant="h6" sx={{  }} >
                                    {t('Total')}
                                </Typography>
                                <span>{order.total}</span>
                            </Box>                        
                        </Grid>


                        <Grid sx={{ p: 2, my: 2, borderRadius: 4 }} component={Paper}>
                            <Typography variant="h5" sx={{ py: 2 }} >
                                {t('DeliveryAddress')}
                            </Typography>
                            <Box display="flex" justifyContent="space-between" alignItems="center" >
                                <Typography variant="h6" sx={{}} >
                                    {t('Address')}
                                </Typography>
                                <span>{order.shippingAddress.address1}</span>
                            </Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" >
                                <Typography variant="h6" sx={{}} >
                                    {t('Country')}
                                </Typography>
                                <span>{order.shippingAddress.country}</span>
                            </Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" >
                                <Typography variant="h6" sx={{}} >
                                    {t('City')}
                                </Typography>
                                <span>{order.shippingAddress.city}</span>
                            </Box>
                        </Grid>





                    </Grid>
            </Grid>

            </Box>
        </>

    )
}