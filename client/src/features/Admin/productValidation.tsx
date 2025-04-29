import * as yup from 'yup';

export const validationSchema = yup.object({
    nameEn: yup.string().required('English name is required'),
    nameAr: yup.string().required('Arabic name is required'),
    descriptionEn: yup.string().required('English description is required'),
    descriptionAr: yup.string().required('Arabic description is required'),
    price: yup.number().required('Price is required').moreThan(0, 'Price must be greater than 0'),
    // pictureUrl: yup.string().required('Image URL is required'),
    type: yup.string().required('Type is required').min(1, 'Type must be at least 1'),
    brand: yup.string().required('Brand is required'),
    quantityStock: yup.number().required('Quantity in stock is required').min(0, 'Quantity cannot be negative'),
    size: yup.string().required('Size is required'),
    sugar: yup.string().required('Sugar level is required'),
    fat: yup.string().required('Fat level is required'),
    file: yup.mixed().when('pictureUrl', {
       is: (value: string) => !value,
       then: (schema) => schema.required('Please provide an image file'),
       otherwise: (schema) => schema.notRequired()
    })
});