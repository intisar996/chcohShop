import { useCallback, useEffect, useState } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingComponent from "./LoadingComponent";
import { fetchBasketAsync} from "../../features/Basket/BasketSlice";
import { useAppDispatch } from "../../store/configureStore";
import { fetchCurrentAsync } from "../../features/Account/accountSlice";
import '../../../public/Css/main.css'
import '../../Translation/i18n';

function App() {

    // to get basket item
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);



    const initApp = useCallback(async () =>  {
        try {
           const currentUser =   await dispatch(fetchCurrentAsync());
            const currentBasketccccccccc =    await dispatch(fetchBasketAsync());
            console.log("dispatchfetchCurrentAsync", currentUser)
            console.log("fetchBasketAsync", currentBasketccccccccc)


        } catch (error) {
            console.log(error);
        }
    }, [dispatch])



    useEffect(() => {
        initApp().then(() => setLoading(false));
    }, [initApp])
 


    const [darkMode, setDarkMode] = useState(false);
    const paletteType = darkMode ? 'dark' : 'light'

     
    const theme = createTheme({
        palette: {
            mode: paletteType,
            background: {
                default: paletteType === 'light' ? '#eaeaea' : '#000000'
            }
        }
    })


    function handleThemeChange() {
        setDarkMode(!darkMode);
    }

    if (loading) return <LoadingComponent message="Initialising app .."/>

  return (
      <ThemeProvider theme={theme}>
          <ToastContainer position="bottom-right" hideProgressBar  theme="colored" />
          

      <CssBaseline />
          <Navbar darkMode={darkMode} handleThemeChange={handleThemeChange} />

              <Outlet />


      </ThemeProvider>
  )
}

export default App


