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
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Checkbox from "@mui/material/Checkbox";

export default function ConfirmUser({ setIsReady, isConfirmed, setIsConfirmed, userId, setUserId, setOpenConfirm,openConfirm, confirmationPhoto, confirmationVideo, email, setEmail, name, setName, phoneNumber, setPhoneNumber, handleAlert, type }) {


    const handleClose = () => {
        setName('')
        setPhoneNumber('')
        setPassword('')
        setPasswordConfirmation('')
        setEmail('')
        setErrorMessage('')
        setErrors({})
        setUserId('')
        setIsConfirmed(0)
        setOpenConfirm(false);
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
                password_confirmation: passwordConfirmation,
                is_confirmed: isConfirmed ? 1 : 0,
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

    const Player = ({ id, video }) => (
        <video height="450" width="100%"  key={id} controls>
            <source src={video} />
        </video>
    );

    return (
        <div>
            <Dialog fullWidth maxWidth={"md"} open={openConfirm} onClose={handleClose}>
                <DialogTitle>
                    {userId !== '' ? 'Edit User Information' : 'Add New User'}
                </DialogTitle>
                <DialogContent>
                    {errorMessage !== '' ?
                        <DialogContentText color={"error.main"}>
                            {errorMessage}
                        </DialogContentText>
                    : null }
                    <div>
                        <FormLabel id="demo-controlled-radio-buttons-group">Confirmation Video</FormLabel>
                        <br />
                        {confirmationVideo !== '' ?
                            <Player id={userId} video={confirmationVideo} />
                        : null}
                    </div>
                    <div>
                        <FormLabel id="demo-controlled-radio-buttons-group">Confirmation Image</FormLabel>
                        <br />
                        <img width={"100%"} src={confirmationPhoto} alt="confirmation image" />
                    </div>
                    <div align={"center"}>
                        <FormControl>
                            <FormControlLabel control={<Checkbox checked={Boolean(isConfirmed)} onChange={() => setIsConfirmed(!isConfirmed)} size={"large"} />} label="Is User Confirmed" />
                        </FormControl>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button disabled={isLoading} onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
