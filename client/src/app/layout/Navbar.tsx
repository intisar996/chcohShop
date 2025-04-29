/* eslint-disable @typescript-eslint/no-unused-vars */
import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, Divider, Drawer, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../../store/configureStore";
import SignedInMenu from "./SignedInMenu";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from "react-i18next";
import Grid from '@mui/material/Grid2';


const drawerWidth = 240;






const NavStyles = [
    {
        color: 'inherit',
        typography: 'h6',
         whiteSpace: 'nowrap',
        '&:hover': {
            color: 'grey.500',
        },
        '&.active': {
            color: 'text.secondary'
        }
    }
]



interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
    window?: () => Window;

}
export default function Navbar({ darkMode, handleThemeChange }: Props, props: Props) {
    const { t } = useTranslation();


    const midLinks = [
        { title: t('nav-home'), path: '/' },
        { title: t('nav-about'), path: '/about' },
        { title: t('nav-product'), path: '/product' },
        { title: t('nav-contact'), path: '/contact' },

    ]


    const rightLinks = [
        { title: t('login'), path: '/login' },
        { title: t('register'), path: '/register' },


    ]



    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);

   //const isMediumDevice = useMediaQuery(
   //     "only screen and (min-width: 769px) and (max-width: 992px)"
   // );


    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

  

    const { basket } = useAppSelector(state => state.basket);

    const { user } = useAppSelector(state => state.account);




    const itemCount = basket?.items?.reduce((sum, item) => sum + item.quantity, 0);



    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', backgroundColor: '#192230' }}>
            <Box display='flex' alignItems='center' justifyContent='center'>
                <Typography variant='h6' component={NavLink} to='/'
                    sx={{ color: '#ffcd00', textDecoration: 'none', fontFamily: 'FireSpace', my: 2 }}
                >
                    Chocho
                </Typography>
                <Switch checked={darkMode} onChange={handleThemeChange} />
            </Box>
            <Divider />
            <List sx={{ display: 'flex',flexDirection:'column',color:'#ffffff' }}>
                {midLinks.map(({ title, path }) => (
                    <ListItem
                        component={NavLink}
                        to={path}
                        key={path}
                        sx={NavStyles}

                    >
                        {title.toLocaleUpperCase()}
                    </ListItem>

                ))}

            </List>
        </Box>
    );




    const container = window !== undefined ? () => window().document.body : undefined;




    return (
        <>
            <AppBar position='static' sx={{backgroundColor: '#192230'}}>
                <Toolbar sx={{  marginRight: 0,justifyContent:'space-between' }}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>



                    <Grid display='flex' flexWrap="wrap" alignItems='center' justifyContent='space-around' flexDirection='row' sx={{
                        width: '100%', margin: 0
                    }}>

                        <Grid size={1} flexDirection='row'>
                    <Box  sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                    <Typography variant='h6' component={NavLink} to='/'
                            sx={{ color: '#ffcd00', textDecoration: 'none', fontFamily:'FireSpace' }}
                    >
                        Chocho
                                </Typography>
 
                            </Box>
                        </Grid>

                        <Grid size={8} sx={{ flexBasis: '40%' }}>


                    <Box sx={{ display: { xs: 'none', sm: 'none',md:'block' } }}>
                    <List sx={{ display: 'flex' }}>
                        {midLinks.map(({ title, path }) => (
                            <ListItem
                                component={NavLink}
                                to={path}
                                key={path}
                                sx={NavStyles}


                            >
                                {title.toLocaleUpperCase()}
                            </ListItem>

                        ))}



                    </List>
                            </Box>
                        </Grid>


                        <Grid size={3}>

                            <Box display='flex' alignItems='center'>
                                <LanguageSwitcher />

                                <Switch checked={darkMode} onChange={handleThemeChange} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } } } />
                    <IconButton component={Link} to='/basket' size='large' edge='start' color='inherit' sx={{ mr: 2}}>

                        <Badge badgeContent={itemCount} color="secondary">
                            <ShoppingCart />
                        </Badge>

                    </IconButton>

                    {user ? (
                        <SignedInMenu />
                    ) : (
                            <List sx={{ display: 'flex' }}>

                                {rightLinks.map(({ title, path }) => (

                                    <ListItem
                                        component={NavLink}
                                        to={path}
                                        key={path}
                                        sx={NavStyles}
                                        className='signIn'

                                    >

                                        {title.toUpperCase()}
                                    </ListItem>

                                ))}
                            </List>
                    ) }
             


                            </Box>

                        </Grid>

                    </Grid>

            </Toolbar>
             </AppBar >
                   <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
              display: { xs: 'block', sm: 'block',md:'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#192230' },
          }}
        >
          {drawer}
        </Drawer>
      </nav>

      </>
     )
}