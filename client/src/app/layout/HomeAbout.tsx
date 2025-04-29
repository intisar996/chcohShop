import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';


interface Props {
    title: string,
    text: string,
    image:string
}

export default function HomeAbout({title, text, image } : Props) {
    return (
        <>
            <Box sx={{ width: '100%', py: 5, backgroundColor:'#5B1F07'} } >
                <Grid container rowSpacing={1} columnSpacing={{xs:1,sm:2,md:3}} display='flex' justifyContent='center' >                 
                    <Grid size={{ xs: 12, md: 6 }} sx={{ backgroundColor: '#e6d7c35c', p: 6, borderRadius: 5 }}>
                        <Typography variant='h3' fontFamily='FireSpace' textAlign='center'>
                            {title}
                        </Typography>
                        <Typography variant='body1'>
                            {text}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}  position='relative'>
                        <img src={image} alt='About Us' width='100%'></img>
                        <svg className='chobar' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1077 343.79" style={{ right: '0px', width: ' 100%' }}>
                            <g>
                                <path className="cls-1"  d="m1077,0c-16.24,11.66-27.15,36.26-20.63,87.17,19.41,151.41-86.5,120.63-94.34,33.47-7.83-87.05-51.9-86.93-78.22-85.41-25.44,1.47-37.74,31.21-69.88,75.72-50.47,69.88-122.5,73.27-188.49-4.37-41.62-48.96-66.41-57-81.47,4.31-6.2,25.25,6.97,152.15-73.14,140.38-33.87-4.97-38.76-30.56-40.54-63.89-9.65-52.74-34.31-75.84-58.71-77.25-27.85-1.6-60.81,9.68-73.93,37.47-17.51,37.06-3.23,72.13-1.98,114.13,1.25,41.99-8.5,74.48-45.27,80.93-31.53,5.54-64.95-9.21-71.83-44.39s.9-55.07,4.93-90.81c4.04-35.75,8.1-96.53-32.3-99.33-32.8-2.27-38.85-99.83-53.02-82.27-16.57,20.54-25.73,32.99-48.35,31.6C24.99,55.93,10.39,29,0,13.76V0h1077Z">

                                </path>
                            </g>
                        </svg>
                    </Grid>

                </Grid>
            </Box>

        </>
    )
}