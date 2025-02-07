import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";



export default function LogInPrompt({user, open}) {

    const navigate = useNavigate();

    const signIn = () => {
        let currentPage = window.location.pathname
        console.log(currentPage);
        navigate('/');
    }

    return (
        <Dialog open={open}>
            <DialogTitle sx={{ background: '#c4a847', color: 'white', padding: '0vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <h2 style={{ padding: '0vh' }}>Want to sign in?</h2>
            </DialogTitle>
            <DialogContent sx={{background: '#304653'}}>
                <h3 style={{fontWeight: 'bold', color: 'white', marginTop: '5%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>Looks like you're not signed in! <br />Click the button to log into your account!</h3>
            </DialogContent>
            <DialogActions sx={{background: '#304653', display: 'flex', justifyContent:'center', alignContent: 'center'}}>
                <Button onClick={signIn} sx={{
                    background: '#e9654b', color: 'white', fontWeight: 'bold', fontSize: 'x-large', width: '50%', height: '50px', '&:hover': {
                        backgroundColor: '#eb8c7a',
                    }
                }}>
                    Sign In!
                </Button>
            </DialogActions>
        </Dialog>
    );
}