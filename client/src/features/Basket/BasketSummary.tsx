import { TableContainer, Paper, Table, TableBody, TableRow, TableCell } from "@mui/material";
import { useAppSelector } from "../../store/configureStore";
import { useTranslation } from "react-i18next";

export default function BasketSummary() {
    const { basket } = useAppSelector(state => state.basket);
    const subtotal = basket?.items?.reduce((amount, item) => Number(item.price * item.quantity) + amount , 0) ?? 0;
    const deliveryFee = subtotal > 100 ? 0 : 2;
    const { t} = useTranslation();



    return (
        <>
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>{t('SubTotal')}</TableCell>
                            <TableCell align="right">{(subtotal).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>{t('Delivery fee')}*</TableCell>
                            <TableCell align="right">{(deliveryFee).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>{t('Total')}</TableCell>
                            <TableCell align="right">{((subtotal + deliveryFee)).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <span style={{ fontStyle: 'italic' }}>{t('DeliveryFree')}</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}