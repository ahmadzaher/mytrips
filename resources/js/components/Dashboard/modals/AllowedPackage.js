import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useState} from "react";
import axios from "axios";

export default function AllowedPackage({ setIsReady, id, setId, setOpen,open, handleClickOpen, description, setDescription, name, setName, handleAlert }) {


    const handleClose = () => {
        setName('')
        setPassword('')
        setPasswordConfirmation('')
        setDescription('')
        setErrorMessage('')
        setErrors({})
        setId('')
        setOpen(false);
    };
    const handleSave = () => {
        setIsLoading(true)
        axios({
            method: id !== '' ? 'put' : 'post',
            url: `api/admin/allowed_packages/${id}`,
            data: {
                name,
                description,
                password,
                password_confirmation: passwordConfirmation
            }
        })
            .then(res => {
                handleClose()
                let message = id !== '' ? 'Updated Successfully!' : 'Added Successfully!'
                handleAlert('success', message)
                setIsReady(false)
            })
            .catch(e => {
                if(e.response.status === 422){
                    setErrorMessage(e.response.data.message)
                    setErrors(e.response.data.errors)
                }else{
                    handleAlert('error', 'Something went wrong!')
                }
            })
            .then(() => {
                setIsLoading(false)
            })
    };

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errorMessage, setErrorMessage] = useState('')
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)


    return (
        <div>
            <Button size="large" variant="outlined" onClick={handleClickOpen}>
                اضافة غرض مسموح جديد
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    تعديل معلومات الغرض المسموح
                </DialogTitle>
                <DialogContent>
                    {errorMessage !== '' ?
                        <DialogContentText color={"error.main"}>
                            {errorMessage}
                        </DialogContentText>
                    : null }
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="الاسم"
                        type="text"
                        fullWidth
                        variant="standard"
                        error={errors.name !== undefined}
                        helperText={errors.name !== undefined && errors.name[0] !== undefined ? errors.name[0] : ''}
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        aria-invalid={true}
                    />
                    <TextField
                        margin="dense"
                        id="description"
                        label="الوصف"
                        type="text"
                        fullWidth
                        variant="standard"
                        error={errors.description !== undefined}
                        helperText={errors.description !== undefined && errors.description[0] !== undefined ? errors.description[0] : ''}
                        onChange={(e) => setDescription(e.target.value)}
                        value={description !== null && description !== 'null' ? description : ''}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button disabled={isLoading} onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
