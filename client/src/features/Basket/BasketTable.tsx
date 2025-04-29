import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import { removeBasketItemAsync, addBasketItemAsync } from "./BasketSlice";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { Item } from "../../app/models/Basket";
import { useTranslation } from "react-i18next";


interface Props {
    items: Item[];
    isBasket?: boolean;
    widthsize: number;
    
}


export default function BasketTable({ items, isBasket = true, widthsize }: Props) {
    const {status,basket } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();
    const { t, i18n } = useTranslation();

    console.log("basket from BasketTable", basket?.items)




    return (

        <TableContainer>
            <Table sx={{widthsize}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell> {t('Product')}</TableCell>
                        <TableCell align="right">{t('Price')}</TableCell>
                        <TableCell align="right">{t('Quantity')}</TableCell>
                        <TableCell align="right">{t('SubTotal')}</TableCell>
                        {isBasket &&
                            <TableCell align="right"></TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map(item => (
                        <TableRow
                            key={item.productId}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                <Box display='flex' alignItems='center'>
                                    <img src={item.picterUrl} alt={item.nameEn} style={{ height: 50, marginRight: 20 }} />
                                    <span>{i18n.language === "ar" ? item.nameAr : item.nameEn}</span>
                                </Box>
                            </TableCell>
                            <TableCell align="right">OR.{(item.price).toFixed(2)}</TableCell>
                            <TableCell align="right">
                                {isBasket &&
                                    <LoadingButton
                                        loading={status === 'pendingRmoveItem' + item.productId + 'rem'}
                                        onClick={() => dispatch(removeBasketItemAsync({

                                            productId: item.productId, quantity: 1, name: 'rem'
                                        }))}
                                        color='error'>
                                        <Remove />
                                    </LoadingButton>}
                                {item.quantity}
                                {isBasket &&
                                    <LoadingButton
                                        loading={status === 'pendingAddItem' + item.productId}
                                        onClick={() => dispatch(addBasketItemAsync({ productId: item.productId }))}
                                        color='secondary'>
                                        <Add />
                                    </LoadingButton>}
                            </TableCell>
                            <TableCell align="right">OR.{((item.price * item.quantity)).toFixed(2)}</TableCell>
                            {isBasket &&
                            <TableCell align="right">
                                <LoadingButton
                                    loading={status === 'pendingRmoveItem' + item.productId + 'del'}

                                    onClick={() => dispatch(removeBasketItemAsync({
                                        productId: item.productId, quantity: item.quantity, name: 'del'

                                    }))}

                                    color='error'>
                                    <Delete />
                                </LoadingButton>

                            </TableCell> }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

    );
}