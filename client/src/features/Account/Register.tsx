﻿import { LockOutlined } from "@mui/icons-material";
import { Avatar, Box, Container, Paper, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Link, useNavigate } from "react-router-dom";
import {useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";


export default function Register() {

    const navigate = useNavigate();
    const { register, handleSubmit,setError, formState: { isSubmitting, errors, isValid } } = useForm({
        mode: 'onTouched'
    });

    function handleApiErrors(errors: any) {
        if (errors) {
            errors.forEach((error: string) => {
                if (error.includes('Password')) {
                    setError('password', { message: error })
                } else if (error.includes('Email')) {
                    setError('email', { message: error })
                } else if (error.includes('Username')) {
                    setError('username', { message: error })
                }
            })
        }
    }


    return (

        <Container component={Paper} maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlined />
            </Avatar>

            <Typography component="h1" variant="h5">
                Sign Up
            </Typography>

            <Box component="form" onSubmit={handleSubmit(data => agent.Account.register(data)
                .then(() => {
                    toast.success('Registration successful - you can now login');
                    navigate('/login');
                })
                .catch(error => handleApiErrors(error)))}
                noValidate sx={{ mt: 1 }}>
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
                    label="User Email"
                    autoComplete="email"
                    type="Email"
                    {...register('email', {
                        required: 'email is required',
                        pattern: {
                            value: /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}/,
                            message:'Not a valid email address'
                        }
                    })}
                    error={!!errors.email}
                    helperText={errors?.email?.message as string}
                >
                </TextField>
                <TextField
                    margin="normal"
                    fullWidth
                    type="password"
                    label="Password"
                    {...register('password', {
                        required: 'Password is required',
                        pattern: {
                            value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                            message: 'The password must meet the following requirements: at least one uppercase letter, one special character, one number, and be between 6 to 10 characters without spaces.'
                        }
                    })}
                    error={!!errors.password}
                    helperText={errors?.password?.message as string}
                >
                </TextField>
                <LoadingButton
                    loading={isSubmitting}
                    disabled={!isValid}
                    type="submit"
                    fullWidth
                    variant="contained" sx={{ mt: 3, mb: 2 }} >
                    Sign Up
                </LoadingButton>
                <Grid container direction="column" spacing={2}>
                  
                    <Link to="/login">
                        {"Already have an accoutn? Sign Up"}
                    </Link>
                </Grid>


            </Box>


        </Container>


    )
}
