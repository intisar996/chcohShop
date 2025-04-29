import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { fetchOrdersAsync, myOrderSelectors } from "./OrderSlice";
import { useEffect } from "react";
import { Order } from "../../app/models/order";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Link } from "react-router-dom";



export default function Orders() {

    const { myOrdersLoaded} = useAppSelector(state => state.order)
    const orders = useAppSelector(state => myOrderSelectors.selectAll(state));



    const dispatch = useAppDispatch();


    useEffect(() => {


        // Get Product Info

        if (!myOrdersLoaded) dispatch(fetchOrdersAsync());


    }, [dispatch, myOrdersLoaded])


    if (!myOrdersLoaded) return <LoadingComponent message="Loading Order ..." />



    return (
        <Box display="flex"
            justifyContent="center"
            alignItems="center"
            py={8}
            px={8 }

        >
        <TableContainer  component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Customer Name</TableCell>
                        <TableCell align="right">Order No</TableCell>
                        <TableCell align="right">Total Price</TableCell>
                        <TableCell align="right">OrderDate</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right"></TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order : Order) => (
                        <TableRow
                            key={order.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {order.shippingAddress.fullName}
                            </TableCell>
                            <TableCell align="right">{order.id}</TableCell>
                            <TableCell align="right">{order.total}</TableCell>
                            <TableCell align="right">
  {new Date(order.orderDate).toLocaleString('ar-EG', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })}
</TableCell>
                            <TableCell align="right">{order.paymentStatus}</TableCell>
                            <TableCell>
                                <Button
                                    component={Link}
                                    to={`/order/${order.id}`}
                                >View</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>

            </Box>

    );
}