import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { AuthContext } from "../../Context/UserContext";
import {useContext, useState} from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Grid from "@mui/material/Grid";
import { Divider } from '@mui/material';
import AllowedPackage from "./modals/AllowedPackage";

export default function AllowedPackages() {


    const columns = [
        {
            field: 'name',
            renderHeader: () => (
                <b style={{ color: '#5e5d5d' }}>
                    {'Name '}
                </b>
            ),
            width: 300
        },
        {
            field: 'description',
            renderHeader: () => (
                <b style={{ color: '#5e5d5d' }}>
                    {'Description '}
                </b>
            ),
            width: 450
        },
        {
            field: 'actions',
            renderHeader: () => (
                <b style={{ color: '#5e5d5d' }}>
                    {'Actions '}
                </b>
            ),
            renderCell: (params) => (
                <Grid container spacing={2}>
                    <IconButton color="success" onClick={() => editRecord(params.row.id)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteRecord(params.row.id)}>
                        <DeleteOutlineIcon sx={{ color: '#d32f2f' }} />
                    </IconButton>
                </Grid>
            ),
            description: 'This column is not sortable.',
            sortable: false,
        },
    ];

    const {
        handleAlert,
    } = useContext(AuthContext)

    const editRecord = (p_id) => {
        setId(p_id)

        axios.get(`api/admin/allowed_packages/${p_id}`)
            .then((res) => {
                if(res.status === 200)
                {
                    setName(res.data.data.name)
                    setDescription(res.data.data.description)
                }
            })
            .catch((e) => {
                console.log(e)
                alert('Something went wrong!')
            })
        handleClickOpen()
    }

    const deleteRecord = (id) => {
        let confirmDelete = window.confirm('Want to delete?')
        if(confirmDelete){
            axios.delete(`api/admin/allowed_packages/${id}`)
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
    const [allowedPackages, setAllowedPackages] = useState([])
    const [open, setOpen] = useState(false);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    React.useEffect(() => {
        if(!isReady){
            axios.get(`api/admin/allowed_packages`)
                .then((res) => {
                    if(res.status === 200)
                    {
                        setAllowedPackages(res.data.data)
                    }
                })
                .then(() => setIsReady(true))
                .catch((e) => {
                    console.log(e)
                })
        }
    }, [isReady])


    const handleClickOpen = () => {
        setOpen(true);
    };

    return (
        <div>
            <AllowedPackage
                setIsReady={setIsReady}
                open={open}
                setOpen={setOpen}
                id={id}
                setId={setId}
                handleClickOpen={handleClickOpen}
                name={name}
                setName={setName}
                description={description}
                setDescription={setDescription}
                handleAlert={handleAlert}
            />
            <br />
            <Divider />
            <br />
            <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={allowedPackages}
                    columns={columns}
                    pageSize={10}
                    rowSpacingType={'margin'}
                    rowsPerPageOptions={[10]}
                    loading={!isReady}
                />
            </div>
        </div>
    );
}
