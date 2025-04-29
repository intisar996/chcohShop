
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/system';
import { Controller, useFormContext } from 'react-hook-form';
import AppTextInput from '../../app/components/AppTextInput';
import { Checkbox, FormControlLabel } from '@mui/material';

const FormGrid = styled(Grid)(() => ({
    display: 'flex',
    flexDirection: 'column',
}));

export default function AddressForm() {

    const { control, formState} = useFormContext();

    return (

        <Grid container spacing={3}>
            <FormGrid size={{ xs: 12, md: 12 }}>
                <FormLabel htmlFor="fullName" required>
                    Full  name
                </FormLabel>
                <AppTextInput control={control } name='fullName' label='Full name' />
            </FormGrid>
            <FormGrid size={{ xs: 12 }}>
                <FormLabel htmlFor="address1" required>
                    Address line 1
                </FormLabel>
                <AppTextInput control={control} name='address1' label='Address 1' />

            </FormGrid>
            <FormGrid size={{ xs: 12 }}>
                <FormLabel htmlFor="address2">Address line 2</FormLabel>
                <AppTextInput control={control} name='address2' label='Address 2' />

            </FormGrid>
            <FormGrid size={{ xs: 6 }}>
                <FormLabel htmlFor="city" required>
                    City
                </FormLabel>
                <AppTextInput control={control} name='city' label='City' />
                
            </FormGrid>
            <FormGrid size={{ xs: 6 }}>
                <FormLabel htmlFor="state" required>
                    State
                </FormLabel>
                <AppTextInput control={control} name='state' label='State' />

            </FormGrid>
            <FormGrid size={{ xs: 6 }}>
                <FormLabel htmlFor="zip" required>
                    Zip / Postal code
                </FormLabel>
                <AppTextInput control={control} name='postal_code' label='postalCode' />

            </FormGrid>
            <FormGrid size={{ xs: 6 }}>
                <FormLabel htmlFor="country" required>
                    Country
                </FormLabel>
                <AppTextInput control={control} name='country' label='Country' />

            </FormGrid>
            <FormGrid size={{ xs: 12 }}>
            <Controller
  name="saveAddress"
  control={control}
  render={({ field }) => (
    <FormControlLabel
      disabled={!formState.isDirty}
      control={<Checkbox {...field} />}
      label="Save this as default address"
    />
  )}
/>

                </FormGrid>
        </Grid>

    );
}