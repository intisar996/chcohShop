
import { Language } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';



export default function LanguageSwitcher() {

    const { i18n } = useTranslation();

    const changeLanguage = (lng: any) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
        handleCloseMenu();

    }

    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenMenu = (event :any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

  
    return (



        <div>
            <IconButton
                color="inherit"
                aria-label="select language"
                onClick={handleOpenMenu}
                edge="start"
                sx={{ mr: 2 }}
            >
                <Language />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
                <MenuItem onClick={() => changeLanguage('ar')}>Arabic</MenuItem>
            </Menu>
        </div>

    );
}


