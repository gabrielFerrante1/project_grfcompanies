import { useEffect } from 'react';
import NProgress from 'nprogress';
import { Box, CircularProgress } from '@mui/material';

type Props = {
    noLoadNp?: boolean,
    noLoadProgress?: boolean
}

const SuspenseLoader = ({ noLoadNp = false, noLoadProgress = false }: Props) => {
    useEffect(() => {
        if (!noLoadNp) {
            NProgress.start();

            return () => {
                NProgress.done();
            };
        }
    }, []);

    return (
        <Box
            sx={{
                position: 'fixed',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%'
            }}
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            {!noLoadProgress && <CircularProgress size={64} disableShrink thickness={3} />}
        </Box>
    );
}

export default SuspenseLoader;
