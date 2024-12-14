import React from 'react';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';

export default function MenuButton({
                                     showBadge = false,
                                     onClick,
                                     ...props
                                   }) {
  return (
      <Badge
          color="error"
          variant="dot"
          invisible={!showBadge}
          sx={{ '& .MuiBadge-badge': { right: 2, top: 2 } }}
      >
        <IconButton size="small" onClick={onClick} {...props} />
      </Badge>
  );
}
