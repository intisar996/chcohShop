import { LockOutlined } from "@mui/icons-material";
import { Avatar, Box, Checkbox, Container, FormControlLabel, Paper, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch } from "../../store/configureStore";
import { SignInAsync } from "./accountSlice";
import GoogleOAuth from "../../app/components/GoogleOAuth";


export default function Login() {

    const location = useLocation();
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const { register, handleSubmit, formState: { isSubmitting, errors, isValid } } = useForm({
        mode : 'onTouched'
    });





    async function submitForm(data: FieldValues) {

        try {
            await dispatch(SignInAsync(data));
            navigate(location.state?.from || '/product');
        } catch(error) {
            console.log(error);
        }
       
    }

    return (

        <Container component={Paper} maxWidth="xs" sx={{display:'flex',flexDirection:'column',alignItems:'center',p:4,py:'2', marginTop:'5%'} }>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                 Sign In
                </Typography>

            <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{mt:1} }>
                    <TextField

                    margin="normal"
                    fullWidth
                    label="User Name"
                    autoComplete="username"
                    autoFocus
                    {...register('username', { required: 'Username is required' })}
                    error={!!errors.username}
                    helperText={errors?.username?.message as string}
                    >
                    </TextField>
                    <TextField
                    margin="normal"
                    fullWidth
                    type="password"
                    label="Password"
                    {...register('password', { required: 'Password is required' })}
                    error={!!errors.password}
                    helperText={errors?.password?.message as string}
                    >
                    </TextField>

                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" /> }
                        label="Remember me"
                    />
                <LoadingButton
                    loading={isSubmitting}
                    disabled={!isValid}
                    type="submit"
                    fullWidth
                    variant="contained" sx={{ mt: 3, mb: 2 }} >
                       Sign In
                </LoadingButton>

                <Grid container direction="column" spacing={2}>
                <GoogleOAuth />
                </Grid>

                    <Grid container direction="column" spacing={2}>
                            <Link to="#">
                              Forgot password?
                            </Link>
                            <Link  to="/register">
                                {"Don't have an accoutn? Sign Up" }
                            </Link>
                    </Grid>


                </Box>


        </Container>


    )
}
