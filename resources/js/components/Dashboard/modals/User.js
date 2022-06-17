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

export default function User({ setIsReady, userId, setUserId, setOpen,open, handleClickOpen, email, setEmail, name, setName, phoneNumber, setPhoneNumber, handleAlert, type }) {


    const handleClose = () => {
        setName('')
        setPhoneNumber('')
        setPassword('')
        setPasswordConfirmation('')
        setEmail('')
        setErrorMessage('')
        setErrors({})
        setUserId('')
        setOpen(false);
    };
    const handleSave = () => {
        setIsLoading(true)
        axios({
            method: userId !== '' ? 'put' : 'post',
            url: `api/admin/${type}/${userId}`,
            data: {
                name,
                email,
                phone_number: phoneNumber,
                password,
                password_confirmation: passwordConfirmation
            }
        })
            .then(res => {
                handleClose()
                let message = userId !== '' ? 'Updated Successfully!' : 'Added Successfully!'
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
                Add new {type === 'user' ? 'User' : 'Staff'}
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {userId !== '' ? 'Edit User Information' : 'Add New User'}
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
                        label="Name"
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
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        error={errors.email !== undefined}
                        helperText={errors.email !== undefined && errors.email[0] !== undefined ? errors.email[0] : ''}
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <TextField
                        margin="dense"
                        id="phone_number"
                        label="Phone Number"
                        type="text"
                        fullWidth
                        variant="standard"
                        error={errors.phone_number !== undefined}
                        helperText={errors.phone_number !== undefined && errors.phone_number[0] !== undefined ? errors.phone_number[0] : ''}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        value={phoneNumber !== null && phoneNumber !== 'null' ? phoneNumber : ''}
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        error={errors.password !== undefined}
                        helperText={errors.password !== undefined && errors.password[0] !== undefined ? errors.password[0] : ''}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <TextField
                        margin="dense"
                        id="password_confirmation"
                        label="Password Confirmation"
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        value={passwordConfirmation}
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
