import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { AuthContext } from "../../Context/UserContext";
import {useContext, useState} from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Grid from "@mui/material/Grid";
import User from "./modals/User";
import { Divider, Avatar } from '@mui/material';
import ConfirmUser from "./modals/ConfirmUser";

export default function Users({ type }) {


    const columns = [
        {
            field: 'name',
            renderHeader: () => (
                <b style={{ color: '#5e5d5d' }}>
                    {'Name '}
                </b>
            ),
            renderCell: (params) => (
                <>
                    {params.row.avatar === '' ?
                        <Avatar style={{ backgroundColor: '#1f6cfa', marginRight: 10 }}>{Array.from(params.row.name)[0]}{Array.from(params.row.name)[1]}</Avatar>
                        :
                        <Avatar style={{ marginRight: 10 }} src={params.row.avatar} alt={"avatar"} />
                    }
                    <Typography>
                        {' '}{params.row.name}
                    </Typography>
                </>
            ),
            width: 230
        },
        {
            field: 'email',
            renderHeader: () => (
                <b style={{ color: '#5e5d5d' }}>
                    {'Email '}
                </b>
            ),
            width: 300
        },
        {
            field: 'phone_number',
            renderHeader: () => (
                <b style={{ color: '#5e5d5d' }}>
                    {'Phone Number '}
                </b>
            ),
            width: 160
        },
        {
            field: 'created_at',
            renderHeader: () => (
                <b style={{ color: '#5e5d5d' }}>
                    {'Created At '}
                </b>
            ),
            width: 120
        },
        {
            field: 'is_confirmed',
            renderHeader: () => (
                <b style={{ color: '#5e5d5d' }}>
                    {'Is Confirmed '}
                </b>
            ),
            renderCell: (params) => (
                <>
                    <Typography color={params.row.is_confirmed === 0 ? "error.main" : 'primary'}>
                        {params.row.is_confirmed === 0 ? 'No' : 'Yes'}
                    </Typography>
                    {params.row.is_confirmed === 0 && params.row.confirmation_video !== '' && params.row.confirmation_photo !== '' ?
                        <IconButton color="primary" onClick={() => editConfirm(params.row.id)}>
                            <CheckIcon />
                        </IconButton>
                    : null}

                    {params.row.is_confirmed === 1 ?
                        <IconButton color="error" onClick={() => editConfirm(params.row.id)}>
                            <ClearIcon />
                        </IconButton>
                    : null}

                </>
            ),
            width: 130,
        },
        {
            field: 'role',
            renderHeader: () => (
                <b style={{ color: '#5e5d5d' }}>
                    {'Role '}
                </b>
            ),
            renderCell: (params) => (
                <Typography>
                    {params.row.roles[0].display_name}
                </Typography>
            ),
            width: 130,
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

    if ( type === 'user' ){
        delete columns[5];
    }
    if ( type === 'staff/user' ){
        delete columns[4];
    }

    const {
        handleAlert,
    } = useContext(AuthContext)

    const editRecord = (user_id) => {
        setUserId(user_id)

        axios.get(`api/admin/${type}/${user_id}`)
            .then((res) => {
                if(res.status === 200)
                {
                    setName(res.data.data.name)
                    setEmail(res.data.data.email)
                    setPhoneNumber(res.data.data.phone_number)
                }
            })
            .catch((e) => {
                console.log(e)
                alert('Something went wrong!')
            })
        handleClickOpen()
    }


    const editConfirm = (user_id) => {
        setUserId(user_id)

        axios.get(`api/admin/${type}/${user_id}`)
            .then((res) => {
                if(res.status === 200)
                {
                    setName(res.data.data.name)
                    setEmail(res.data.data.email)
                    setPhoneNumber(res.data.data.phone_number)
                    setIsConfirmed(res.data.data.is_confirmed)
                    setConfirmationPhoto(res.data.data.confirmation_photo)
                    setConfirmationVideo(res.data.data.confirmation_video)
                }
            })
            .catch((e) => {
                console.log(e)
                alert('Something went wrong!')
            })
        handleClickOpenConfirm()
    }

    const deleteRecord = (id) => {
        let confirmDelete = window.confirm('Want to delete?')
        if(confirmDelete){
            axios.delete(`api/admin/${type}/${id}`)
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
    const [users, setUsers] = useState([])
    const [open, setOpen] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(0);;
    const [confirmationPhoto, setConfirmationPhoto] = useState(0);
    const [confirmationVideo, setConfirmationVideo] = useState(0);
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    React.useEffect(() => {
        setIsReady(false)
    }, [type])
    React.useEffect(() => {
        if(!isReady){
            axios.get(`api/admin/${type}`)
                .then((res) => {
                    if(res.status === 200)
                    {
                        setUsers(res.data.data)
                    }
                })
                .then(() => setIsReady(true))
                .catch((e) => {
                    console.log(e)
                })
        }
    }, [isReady, type])


    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClickOpenConfirm = () => {
        setOpenConfirm(true);
    };

    return (
        <div>
            <User
                setIsReady={setIsReady}
                open={open}
                setOpen={setOpen}
                handleClickOpen={handleClickOpen}
                userId={userId}
                setUserId={setUserId}
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                handleAlert={handleAlert}
                type={type}
            />
            <ConfirmUser
                setIsReady={setIsReady}
                openConfirm={openConfirm}
                setOpenConfirm={setOpenConfirm}
                handleClickOpenConfirm={handleClickOpenConfirm}
                userId={userId}
                setUserId={setUserId}
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                handleAlert={handleAlert}
                type={type}
                isConfirmed={isConfirmed}
                setIsConfirmed={setIsConfirmed}
                confirmationPhoto={confirmationPhoto}
                confirmationVideo={confirmationVideo}
            />
            <br />
            <Divider />
            <br />
            <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    pageSize={7}
                    rowSpacingType={'margin'}
                    rowsPerPageOptions={[7]}
                    loading={!isReady}
                    disableSelectionOnClick
                    disableDensitySelector
                />
            </div>
        </div>
    );
}
