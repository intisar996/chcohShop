import { Button, Divider, Paper, Typography } from "@mui/material";
import BasketSummary from "./BasketSummary";
import { useAppSelector} from "../../store/configureStore";
import Grid from '@mui/material/Grid2';
import { Link } from "react-router-dom";
import BasketTable from "./BasketTable";
import { useTranslation } from "react-i18next";

export default function BasketPage() {

    const { t } = useTranslation();

    const { basket } = useAppSelector(state => state.basket);

    console.log("basket from basketPage zzzzzz", basket)

    console.log("Basket items:", basket?.items);
    console.log("Basket items length:", basket?.items?.length);


    if (!basket || !basket.items?.length) {
        return <Typography variant="h1">Your Basket Is Empty</Typography>;
    }
     
    return (
        <Grid container component={Paper} columnSpacing={2} sx={{ px: 5, py: 5,m:4}} >  
        
            <Grid size={{ xs: 12, sm: 12, md: 9 }}  >
                <Typography variant='h5' sx={{mb:2} }  >
                    {t('ShoppingCart')}
                </Typography>
                <Divider />

                <BasketTable items={basket.items} widthsize={500} />
            </Grid>
              
            <Grid size={{ xs: 12, sm: 12, md: 3 }} direction="row" container>
                <BasketSummary />
                <Button
                    component={Link}
                    to='/checkout'
                    variant='contained'
                    size='large'
                    fullWidth
                    style={{ backgroundColor:'#192230'}}
                >
                    Checkout
                </Button>

            </Grid>

          

        </Grid>


       

     )
}