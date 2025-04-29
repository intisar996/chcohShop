/* eslint-disable @typescript-eslint/no-unused-expressions */

import { Container } from "@mui/material";
import AboutImage from '../../../public/images/header.jpg'
import HomeAbout from "../../app/layout/HomeAbout";

export default function AboutPage() {



    return (

        <>
            <Container sx={{ backgroundColor:'#5B1F07'} }>


                <HomeAbout title='About Us' text='We believe chocolate is more than just a treat; it s an experience that blends exquisite taste with joyful moments.We offer the finest chocolates crafted with precision from the highest quality cocoa ingredients.Our goal is to bring a touch of happiness to every occasion through our delightful creations.' image={AboutImage} />

            </Container>

        </>
   )

}