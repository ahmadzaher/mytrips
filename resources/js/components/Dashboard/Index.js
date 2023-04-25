import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArchiveIcon from '@mui/icons-material/Archive';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupIcon from '@mui/icons-material/Group';
import { AuthContext} from "../../Context/UserContext";
import CustomizedSnackbars from "../reusable/CustomizedSnackbars";
import {useContext} from "react";
import { ListSubheader } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { AllInbox, ProductionQuantityLimits } from '@mui/icons-material';


const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function Index({ component, title } ) {
    const { logout } = useContext(AuthContext)
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };



    return (
        <Box sx={{ display: 'flex' }} style={{backgroundColor: '#f5f5f5'}}>
            <CssBaseline />
            <AppBar position="fixed" open={open} style={{backgroundColor: '#636f83'}}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <img style={{
                        objectFit: 'cover',
                        overflow: 'hidden',
                        height: 64,
                        width: '100%'
                    }} src={"http://localhost/my_trips/public/images/logo.jpeg"} alt={"logo"} />
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>

                        {/*dashboard*/}
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        component={'a'}
                        href={'#/app/dashboard'}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary={'لوحة التحكم'} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                    {/*users*/}
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        component={'a'}
                        href={'#/app/users'}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <GroupIcon />
                        </ListItemIcon>
                        <ListItemText primary={'قائمة المستخدمين'} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>

                    {/* staffs */}
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        component={'a'}
                        href={'#/app/staffs'}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <GroupIcon />
                        </ListItemIcon>
                        <ListItemText primary={'قائمة الموظفين'} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>

                    {/* allowed packages */}
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        component={'a'}
                        href={'#/app/allowed_packages'}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <ArchiveIcon />
                        </ListItemIcon>
                        <ListItemText primary={'الأغراض المسموحة'} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>

                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        onClick={logout}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary={'تسجيل الخروج'} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
            <Divider sx={{ my: 1 }} />
                    {/* sub header */}
                    <ListSubheader component="div" inset style={{paddingLeft: 33}}>
                        {'الاعلانات والطلبيات'}
                    </ListSubheader>

                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        component={'a'}
                        href={'#/app/advertisements'}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <ProductionQuantityLimits />
                        </ListItemIcon>
                        <ListItemText primary={'قائمة الاعلانات'} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>

                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                        component={'a'}
                        href={'#/app/orders'}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <AllInbox />
                        </ListItemIcon>
                        <ListItemText primary={'قائمة الطلبيات'} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </List>
                {/*<Divider />*/}

            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', height: '100vh', overflow: 'auto' }} >
                <DrawerHeader />
                <CustomizedSnackbars />
                {component}
            </Box>
        </Box>
    );
}
Index.defaultProps = {
    component: <></>,
    title: 'Dashboard'
};
