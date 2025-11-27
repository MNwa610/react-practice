import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

const ThemeToggle = ({ isDarkMode, onToggle }) => {
  return (
    <Tooltip title={isDarkMode ? "Светлая тема" : "Тёмная тема"}>
      <IconButton onClick={onToggle} color="inherit">
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;