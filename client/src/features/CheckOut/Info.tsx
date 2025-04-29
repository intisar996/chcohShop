import * as React from 'react';

import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import BasketSummary from '../Basket/BasketSummary';
import BasketTable from '../Basket/BasketTable';
import { useAppSelector } from '../../store/configureStore';




export default function Info() {

    const { basket } = useAppSelector(state => state.basket);

    // console.log("basket from Info sssss")


    if (!basket || !basket.items?.length) {
        return <Typography variant="h1">Your Basket Is Empty</Typography>;
    }


    return (
        <React.Fragment>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Orders Detailes
            </Typography>
            <List disablePadding>
                {basket && 
                    <BasketTable items={basket.items} isBasket={false} widthsize={150} />}

                <Grid direction="row" container>
                    <BasketSummary />
                </Grid>
            </List>
        </React.Fragment>
    );
}