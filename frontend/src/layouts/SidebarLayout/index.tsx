import { FC, ReactNode } from 'react';
import { Box, alpha, lighten, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from 'src/utils/auth';
import PageSignin from 'src/content/pages/Auth/Signin';
import { useState, useEffect } from 'react'
import SuspenseLoader from 'src/components/SuspenseLoader';

interface SidebarLayoutProps {
    children?: ReactNode;
}

const SidebarLayout: FC<SidebarLayoutProps> = () => {
    const [loadingAuth, setLoadingAuth] = useState(true)
    const theme = useTheme();

    const { isLogged,  checkAuthentication } = useAuth()

    useEffect(() => {
        const authentication = async () => {
            const authLoading = await checkAuthentication()

            if (authLoading) setLoadingAuth(false)
        }

        authentication()
    }, [])

    if (loadingAuth) return <SuspenseLoader noLoadNp />

    if (isLogged) {
        return (
            <>
                <Box
                    sx={{
                        flex: 1,
                        height: '100%',

                        '.MuiPageTitle-wrapper': {
                            background:
                                theme.palette.mode === 'dark'
                                    ? theme.colors.alpha.trueWhite[5]
                                    : theme.colors.alpha.white[50],
                            marginBottom: `${theme.spacing(4)}`,
                            boxShadow:
                                theme.palette.mode === 'dark'
                                    ? `0 1px 0 ${alpha(
                                        lighten(theme.colors.primary.main, 0.7),
                                        0.15
                                    )}, 0px 2px 4px -3px rgba(0, 0, 0, 0.2), 0px 5px 12px -4px rgba(0, 0, 0, .1)`
                                    : `0px 2px 4px -3px ${alpha(
                                        theme.colors.alpha.black[100],
                                        0.1
                                    )}, 0px 5px 12px -4px ${alpha(
                                        theme.colors.alpha.black[100],
                                        0.05
                                    )}`
                        }
                    }}
                >
                    <Header />
                    <Sidebar />
                    <Box
                        sx={{
                            position: 'relative',
                            zIndex: 5,
                            display: 'block',
                            flex: 1,
                            pt: `${theme.header.height}`,
                            [theme.breakpoints.up('lg')]: {
                                ml: `${theme.sidebar.width}`
                            }
                        }}
                    >
                        <Box display="block">
                            <Outlet />
                        </Box>
                    </Box>
                </Box>
            </>
        );
    }

    return (
        <PageSignin />
    );
};

export default SidebarLayout;
