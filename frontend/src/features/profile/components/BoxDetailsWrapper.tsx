import { Stack, useTheme } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

export default function BoxDetailsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState('auto');
  const theme = useTheme();

  useEffect(() => {
    // Recalculate the height whenever children change
    if (contentRef.current) {
        console.log(contentRef.current.scrollHeight);
        
      setHeight(`${contentRef.current.scrollHeight + 60}px`);
    }
  }, [children]);

  return (
    <Stack
      border={1}
      borderColor={theme.palette.primary.main}
      borderRadius={2}
      mt={-2}
      py={4}
      px={8}
      sx={{ transition: 'height 0.3s ease-in-out', height: height, overflow: 'hidden' }}
    >
      <div ref={contentRef}>
        {children}
      </div>
    </Stack>
  );
}
