import Header from "../../app/layout/Header";
import HomeAbout from "../../app/layout/HomeAbout";
import AboutImage from '../../../public/images/header.jpg'
import Divider from "../../app/layout/Divider";
import CardSlider from "../../app/layout/CardSlider";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { fetchProductsAsync, productSelectors } from "../Product/productSlice";
import { useEffect } from "react";
import Footer from "../../app/layout/footer";
import '../../../public/Css/Home.css';


import { useTranslation } from 'react-i18next';



export default function HomePage() {

    const { t } = useTranslation();

    const products = useAppSelector(productSelectors.selectAll);

    const dispatch = useAppDispatch();
    const { productsLoaded} = useAppSelector(state => state.product)


    useEffect(() => {

        if (!productsLoaded) dispatch(fetchProductsAsync());
    }, [productsLoaded, dispatch])



    return (

        <>
            <Header title={t('welcome')} text={t('welcome-text')} />
            <HomeAbout title={t('AboutUs')} text={t('AboutTextHome')} image={AboutImage} />
            <Divider />
            <CardSlider products={products} />
            <Footer />
        </>
    )
}