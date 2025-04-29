import {
    Card,
    CardActions,
    CardContent,
    Skeleton
} from "@mui/material";
import Grid from "@mui/material/Grid2";


export default function ProductCardSkeleton() {
    return (
        <Grid   component={Card}>
            <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
            <CardContent>
                <>
                    <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                    <Skeleton animation="wave" height={10} width="80%" />
                </>
            </CardContent>
            <CardActions>
                <>
                    <Skeleton animation="wave" height={10} width='40%' />
                    <Skeleton animation="wave" height={10} width="20%" />
                </>
            </CardActions>
        </Grid>
    )
}