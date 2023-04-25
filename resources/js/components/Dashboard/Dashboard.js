import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Container } from "@mui/material";
import {Widget} from '../reusable/widget/Widget'
import { Paper } from "@mui/material";
import {AllInbox, ProductionQuantityLimits, SupervisorAccount} from "@mui/icons-material";
import Users from './Users'
import Orders from "./orders/Orders";
import Advertisements from './orders/Advertisements';
import {useState} from "react";
import axios from "axios";

const Dashboard = () => {

    const [isReady, setIsReady] = useState(false);
    const [orders, setOrders] = useState(0)
    const [advertisements, setAdvertisements] = useState(0)
    const [users, setUsers] = useState(0)
    const [deliveredOrders, setDeliveredOrders] = useState(0)
    React.useEffect(() => {
        if(!isReady){
            axios.get(`api/admin/dashboard/statistics`)
                .then((res) => {
                    console.log(res)
                    if(res.status === 200)
                    {
                        setOrders(res.data.data.number_of_orders)
                        setAdvertisements(res.data.data.number_of_advertisements)
                        setDeliveredOrders(res.data.data.number_of_delivered_orders)
                        setUsers(res.data.data.number_of_users)
                    }
                })
                .then(() => {
                    setIsReady(true)
                })
                .catch((e) => {
                    console.log(e)
                })
        }
    }, [isReady])

    return (
        <section className="dashboard">
            <Container maxWidth="xl">
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2} >
                        <Grid item xs={12} md={3} sm={12}>
                            <Widget backgroundColor={'#1f1498'} title="عدد المستخدمين">
                                {/*<BarChart/>*/}

                                <SupervisorAccount fontSize="medium" />
                                <div>
                                    <span style={{fontSize: 24, fontWeight: 'bold'}}>{users}</span>  مستخدم
                                </div>
                            </Widget>
                        </Grid>
                        <Grid item xs={12} md={3} sm={12}>
                            <Widget backgroundColor={'#2982cc'}  title="عدد الاعلانات">
                                {/*<DoughnutChart/>*/}

                                <ProductionQuantityLimits fontSize="medium" />
                                <div>
                                    <span style={{fontSize: 24, fontWeight: 'bold'}}>{advertisements} </span>   اعلان
                                </div>
                            </Widget>
                        </Grid>
                        <Grid item xs={12} md={3} sm={12}>
                            <Widget backgroundColor={'#f6960b'} title="عدد الطلبيات">
                                {/*<PieChart/>*/}
                                <AllInbox fontSize="medium" />
                                <div>
                                    <span style={{fontSize: 24, fontWeight: 'bold'}}>{orders}</span> طلبية
                                </div>
                            </Widget>
                        </Grid>
                        <Grid item xs={12} md={3} sm={12}>
                            <Widget backgroundColor={'#d93737'} title='عدد الطلبيات المستلمة'>
                                {/*<DataTable/>*/}
                                <AllInbox fontSize="medium" />
                                <div>
                                    <span style={{fontSize: 24, fontWeight: 'bold'}}>{deliveredOrders}</span> طلبية
                                </div>
                            </Widget>
                        </Grid>
                    </Grid>


                    {/* Recent Orders */}
                    <Grid item xs={12} style={{marginTop: 30}}>
                        <Paper elevation={10} sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Orders />
                        </Paper>
                    </Grid>
                    {/* Recent Advertisements */}
                    <Grid item xs={12} style={{marginTop: 30}}>
                        <Paper elevation={10} sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Advertisements />
                        </Paper>
                    </Grid>
                </Box>
            </Container>
        </section>
    )
}

export default Dashboard;
