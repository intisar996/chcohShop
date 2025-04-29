import { FormControl, RadioGroup, FormControlLabel, Radio, Box,  InputLabel, Select } from "@mui/material";



interface Props {
    title:string,
    options: any[];
    onChange: (event: any) => void;
    selectedValue: string;
}



export default function RadioButtonGroup({ options, onChange, selectedValue, title } : Props) {


    return (

     

                <Box>
            <FormControl sx={{ m: { xs: 0, md: 1 }, width: '100%' }}>
                <InputLabel id="" sx={{ color: '#ffcd00' }}>{title}</InputLabel>
                <Select>
                    <FormControl>
                        <RadioGroup onChange={onChange} value={selectedValue}>
                            {options.map(({ value, lable }) => (
                                <FormControlLabel value={value} control={<Radio />} label={lable} key={value} />
                            ))}
                        </RadioGroup>
                    </FormControl>
                       
                </Select>
            </FormControl>
        </Box>



    )
}