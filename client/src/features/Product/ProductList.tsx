import ProductCard from "./ProductCard";
import Grid from '@mui/material/Grid2';
import { Product } from "../../app/models/product";
import { useAppSelector } from "../../store/configureStore";
import ProductCardSkeleton from "./ProductCardSkeleton";



interface Props {
    products: Product[];
}
export default function ProductList({products } :Props) {

    const {productsLoaded} = useAppSelector(state => state.product)


    return (
        <>
            <Grid container spacing={4}  >
                {products.map((product) => (
                    <Grid size={{xs:6,sm:6,md:4}} key={product.id}>
                        {!productsLoaded ? (
                            <ProductCardSkeleton />
                        ) : (
                                <ProductCard product={product} />
                        )}
                    </Grid>
                ))}
            </Grid>
        </>

    )

}