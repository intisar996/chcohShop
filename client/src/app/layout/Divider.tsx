
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import chocho1 from '../../../public/images/5f2505d0df090fb3701c406feb12a9.png'

import chocho2 from '../../../public/images/aly6e11hw.png';
import arrow from '../../../public/images/down-arrow.png';
import { Box, Icon, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';




gsap.registerPlugin(ScrollTrigger)

export default function Divider() {

    const chochoRef1 = useRef(null);
    const chochoRef2 = useRef(null);


    useEffect(() => {

        gsap.fromTo(
            chochoRef1.current,
            { y: -200, opacity: 0 },

            {
                y: 0,
                opacity: 1,
                duration: 2,
                ease: "bounce.out",
                scrollTrigger: {
                    trigger: chochoRef1.current,
                    start: "top 100%",
                    toggleActions: "play none none none",

                },
            }
        );

        gsap.fromTo(
            chochoRef2.current,
            { y: -300, opacity: 0 },

            {
                y: 40,
                opacity: 1,
                duration: 6,
                ease: "bounce.out",
                scrollTrigger: {
                    trigger: chochoRef2.current,
                    start: "top 100%",
                    toggleActions: "play none none none",

                },
            }
        );


    }, []);




    return (

        <Grid container sx={{ py: 5, pt: 2, backgroundColor: "#ffcd00", boxSizing: "border-box", minHeight: "100vh", }} display='flex'  flexDirection='column' position='relative'>

            <svg className='chobar2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1077 343.79" >
                <g>
                    <path className="cls-1"  d="m1077,0c-16.24,11.66-27.15,36.26-20.63,87.17,19.41,151.41-86.5,120.63-94.34,33.47-7.83-87.05-51.9-86.93-78.22-85.41-25.44,1.47-37.74,31.21-69.88,75.72-50.47,69.88-122.5,73.27-188.49-4.37-41.62-48.96-66.41-57-81.47,4.31-6.2,25.25,6.97,152.15-73.14,140.38-33.87-4.97-38.76-30.56-40.54-63.89-9.65-52.74-34.31-75.84-58.71-77.25-27.85-1.6-60.81,9.68-73.93,37.47-17.51,37.06-3.23,72.13-1.98,114.13,1.25,41.99-8.5,74.48-45.27,80.93-31.53,5.54-64.95-9.21-71.83-44.39s.9-55.07,4.93-90.81c4.04-35.75,8.1-96.53-32.3-99.33-32.8-2.27-38.85-99.83-53.02-82.27-16.57,20.54-25.73,32.99-48.35,31.6C24.99,55.93,10.39,29,0,13.76V0h1077Z">

                    </path>
                </g>
            </svg>
            <Typography variant='h2'
                textAlign='center'
                sx={{ pt:5,
                    
                }}
            >
                benfites of Chocho 
            </Typography>
            <Typography variant='body1'
                textAlign='center'
                sx={{
                     pb: 5,
                    color: '#192230', textDecoration: 'none', textAlign: 'center'
                }}
            >
                benfites of Chocho benfites of Chocho benfites of Chocho benfites of Chocho
            </Typography>
            <Box position='relative' sx={{ pt: 5 }}>  

                <Box
                    className="words left"
                    sx={{
                        position: 'absolute',
                        left: '-150px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    <Box
                        className="word"
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 'bold', color: '#6f3203' }}
                        >
                            wow
                        </Typography>
                            <img src={arrow} alt="arrow" className="arrow" />
                    </Box>

                    <Box
                        className="word"
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 'bold', color: '#6f3203' }}
                        >
                            ymmy
                        </Typography>
                            <img src={arrow} alt="arrow" className="arrow" />
                    </Box>
                </Box>



                <Box
                    className="words right"
                    sx={{
                        position: 'absolute',
                        rigth: '20%',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    <Box
                        className="word"
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                            <img src={arrow} alt="arrow" className="arrow2" />
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 'bold', color: '#6f3203' }}
                        >
                            Happy
                        </Typography>

                    </Box>
                    <Box
                        className="word"
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        <img src={arrow} alt="arrow" className="arrow2" />
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 'bold', color: '#6f3203' }}
                        >
                            Love
                        </Typography>

                    </Box>
                </Box>

            <img
                src={chocho1}
                alt="Chocolate Piece 1"
                    ref={chochoRef1}
                    className='chochoRef1'
                style={{
                    position: "absolute",
                    left: "50%",
                    transform:  "translateX(-50%)",
                    width: window.innerWidth < 600 ? "200px" : "350px"
                }}


            />

            <img
                src={chocho2}
                alt="Chocolate Piece 2"
                    ref={chochoRef2}
                    className='chochoRef2'

                style={{
                    position: "absolute",
                    left: "50%",
                    transform:"translateX(-50%)",
                    top: "-50px",
                    width: window.innerWidth < 600 ? "200px" : "350px"
                }}
            />

                

            </Box>


        </Grid>
    
    );
}