import { FormGroup, FormControlLabel, Checkbox, FormControl, Box, InputLabel, Select } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import translationsAr from '../../locales/ar/translation.json';
import translationsEn from '../../locales/en/translation.json';

const translations: { [key: string]: any } = {
    ar: translationsAr,
    en: translationsEn
};


interface Props {
    title: string,
    items: string[];
    checked?: string[];
    onChange: (items: string[]) => void;
}


export default function CheckboxButtons({ items, checked, onChange,title }: Props) {

    const [checkedItems, setCheckedItems] = useState(checked || []);
    const { i18n } = useTranslation();


    const currentLanguage = i18n.language; 

    function handleChecked(value: string) {

        const currentIndex = checkedItems.findIndex(item => item === value);
        let newChecked: string[] = [];
        if (currentIndex === -1) newChecked = [...checkedItems, value];
        else newChecked = checkedItems.filter(item => item !== value);
        setCheckedItems(newChecked);
        onChange(newChecked);


    }


    return (   
        <Box>
            <FormControl sx={{ m: { xs: 0, md: 1 },width: '100%'}}>
                <InputLabel id="" sx={{color: '#ffcd00' }}>{title}</InputLabel>
                <Select>

                    <FormGroup sx={{ p: 1}}>
                        {items.map((item) => (
                            <FormControlLabel
                                control={<Checkbox
                                    checked={checkedItems.indexOf(item) !== -1}
                                    onClick={() => handleChecked(item)}

                                />}
                                label={translations[currentLanguage][item] || item}
                                key={item}
                            />
                        ))}
                    </FormGroup>
                       
                </Select>
            </FormControl>
        </Box>
    )
}