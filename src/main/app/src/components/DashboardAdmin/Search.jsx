import React from 'react';
import { FormControl, InputAdornment, OutlinedInput, useTheme } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

export default function Search() {
    const theme = useTheme();

    return (
        <OutlinedInput
            size="small"
            id="search"
            placeholder="Search…"
            sx={{
                backgroundColor: theme.palette.background.paper, // Light background for input
                '& .MuiInputBase-input': {
                    color: theme.palette.text.primary, // Text color based on theme
                    padding: '4px 8px', // Reduced padding to decrease height
                    fontSize: '14px', // Slightly smaller font size to reduce height
                },
                // Remove the border and box-shadow
                '& .MuiOutlinedInput-root': {
                    border: 'none', // Remove border
                    boxShadow: 'none', // Remove any box shadow
                    height: '32px', // Set a fixed height for the input
                },
                '&:hover .MuiOutlinedInput-root': {
                    border: 'none', // Ensure no border appears on hover
                },
                '&.Mui-focused .MuiOutlinedInput-root': {
                    border: 'none', // Ensure no border appears when focused
                },
            }}
            startAdornment={
                <InputAdornment position="start" sx={{ color: theme.palette.text.primary }}>
                    <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
            }
            inputProps={{
                'aria-label': 'search',
            }}
        />
    );
}

