﻿


import * as yup from 'yup';


export const valiadtionScheme = [
    yup.object({
        fullName: yup.string().required('Full name is required'),
        address1: yup.string().required('Address Line 1 is required'),
        address2: yup.string().required(),
        city: yup.string().required(),
        state: yup.string().required(),
        postal_code: yup.string().required(),
        country: yup.string().required(),

    }),

    yup.object({
    }),
    yup.object()





]