
import { Email, Instagram, LinkedIn, Twitter, WhatsApp, YouTube } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';


export default function footer() {


 



    return(
        <Box className='footer' sx={{ pt: 2, backgroundColor: "#ffcd00", boxSizing: "border-box" }}>
            <Grid container className='footerLink'  spacing={1}  display='flex'  justifyContent='center' alignItems='center' position='relative'>
                <Grid size={{xs:2, md:2} }>
                    <Typography variant='body1'>
                      Home Page
                    </Typography>
                </Grid>
                <Grid size={{ xs: 2, md: 2 }}>
                    <Typography variant='body1'>
                        About Us
                    </Typography>
                </Grid>
                <Grid size={{ xs: 2, md: 2 }}>
                    <Typography variant='body1'>
                        Contact Us
                    </Typography>
                </Grid>

                <Grid size={{ xs: 2, md: 2 }}>
                    <Typography variant='body1'>
                        Happyns
                    </Typography>
                </Grid>
                <Grid size={{ xs: 2, md: 2 }}>
                    <Typography variant='body1'>
                        Happyns
                    </Typography>
                </Grid>
                <Grid size={{ xs: 2, md: 2 }}>
                    <Typography variant='body1'>
                        Item
                    </Typography>
                </Grid>
            </Grid>



            <Grid className='footerIcon' container spacing={1} display='flex' justifyContent='center' alignItems='center' position='relative'>
                <Grid size={{ xs: 2, md: 2 }}>
                    <IconButton
                        color="inherit"
                    >
                        <Instagram />
                    </IconButton>
                </Grid>
                <Grid size={{ xs: 2, md: 2 }}>
                    <IconButton
                        color="inherit"
                    >
                        <Twitter />
                    </IconButton>
                </Grid>
                <Grid size={{ xs: 2, md: 2 }}>
                    <IconButton
                        color="inherit"
                    >
                        <LinkedIn />
                    </IconButton>
                </Grid>

                <Grid size={{ xs: 2, md: 2 }}>
                    <IconButton
                        color="inherit"
                    >
                        <Email />
                    </IconButton>
                </Grid>
                <Grid size={{ xs: 2, md: 2 }}>
                    <IconButton
                        color="inherit"
                    >
                        <WhatsApp />
                    </IconButton>
                </Grid>
                <Grid size={{ xs: 2, md: 2 }}>
                    <IconButton
                        color="inherit"
                    >
                        <YouTube />
                    </IconButton>
                </Grid>
            </Grid>



        </Box>

    );
    
}