import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { AuthContext } from "../../Context/UserContext";
import {useContext, useState} from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Grid from "@mui/material/Grid";
import { Divider, Typography } from '@mui/material';
import { Paper } from "@mui/material";

export default function Orders() {


    const columns = [
        {
            field: 'date',
            renderHeader: () => (
                <b style={{ color: '#5e5d5d' }}>
                    {'التاريخ '}
                </b>
            ),
            renderCell: (params) => (
                <>
                    <Typography>
                        {' '}{params.row.created_at}
                    </Typography>
                </>
            ),
            width: 130
        },
        {
            field: 'name',
            renderHeader: () => (
                <b style={{ color: '#5e5d5d' }}>
                    {'الاسم '}
                </b>
            ),
            renderCell: (params) => (
                <>
                    <Typography>
                        {' '}{params.row.user.name}
                    </Typography>
                </>
            ),
            width: 200,
        },
        {
            field: 'from_country_name',
            renderHeader: () => (
                <b style={{ color: '#5e5d5d' }}>
                    {'مشحون من '}
                </b>
            ),
            renderCell: (params) => (
                <>
                    <Typography>
                        {' '}{params.row.advertisement.from_country_name}<br />{params.row.advertisement.from_city_name}
                    </Typography>
                </>
            ),
            width: 200
        },
        {
            field: 'to_country_name',
            renderHeader: () => (
                <b style={{ color: '#5e5d5d' }}>
                    {'مشحون الى '}
                </b>
            ),
            renderCell: (params) => (
                <>
                    <Typography>
                        {' '}{params.row.advertisement.to_country_name}<br />{params.row.advertisement.to_city_name}
                    </Typography>
                </>
            ),
            width: 200
        },
        {
            field: 'weight',
            renderHeader: () => (
                <b style={{ color: '#5e5d5d' }}>
                    {'الوزن '}
                </b>
            ),
            width: 100
        },
        {
            field: 'cost',
            renderHeader: () => (
                <b style={{ color: '#5e5d5d' }}>
                    {'الكلفة لكل كيلوغرام '}
                </b>
            ),
            renderCell: (params) => (
                <>
                    <Typography>
                        {' $'}{params.row.advertisement.cost}
                    </Typography>
                </>
            ),
            width: 100
        },
        {
            field: 'total_cost',
            renderHeader: () => (
                <b style={{ color: '#5e5d5d' }}>
                    {'الكلفة الاجمالية '}
                </b>
            ),
            renderCell: (params) => (
                <>
                    <Typography>
                       {`$ ${Math.round(parseFloat(params.row.advertisement.cost) * parseFloat(params.row.weight)).toFixed(2)} `}

                    </Typography>
                </>
            ),
            width: 100
        },
        {
            field: 'actions',
            renderHeader: () => (
                <b style={{ color: '#5e5d5d' }}>
                    {'التحكم '}
                </b>
            ),
            renderCell: (params) => (
                <Grid container spacing={2}>
                    <IconButton onClick={() => deleteRecord(params.row.id)}>
                        <DeleteOutlineIcon sx={{ color: '#d32f2f' }} />
                    </IconButton>
                </Grid>
            ),
            description: 'This column is not sortable.',
            sortable: false,
            width: 100
        },
    ];

    const {
        handleAlert,
    } = useContext(AuthContext)


    const deleteRecord = (id) => {
        let confirmDelete = window.confirm('Want to delete?')
        if(confirmDelete){
            axios.delete(`api/admin/order/${id}`)
                .then((res) => {
                    if(res.status === 200){
                        handleAlert('success', 'Deleted Successfully!')
                        setIsReady(false)
                    }
                })
                .catch((e) => {
                    if(e.response.status === 403){
                        handleAlert('error', e.response.data.message)
                    }
                })
        }
    }

    const [isReady, setIsReady] = useState(false);
    const [orders, setOrders] = useState([])
    React.useEffect(() => {
        if(!isReady){
            axios.get(`api/admin/orders`)
                .then((res) => {
                    if(res.status === 200)
                    {
                        setOrders(res.data.data)
                    }
                })
                .then(() => setIsReady(true))
                .catch((e) => {
                    console.log(e)
                })
        }
    }, [isReady])


    return (
        <Paper sx={{ p: 2 }} style={{backgroundColor: '#fff'}}>
            <br />
            <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={orders}
                    columns={columns}
                    pageSize={10}
                    rowSpacingType={'margin'}
                    rowsPerPageOptions={[10]}
                    loading={!isReady}
                />
            </div>
        </Paper>
    );
}
