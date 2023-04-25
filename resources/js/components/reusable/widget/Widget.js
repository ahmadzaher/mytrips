import { IconButton, Paper } from "@mui/material";
import './Widget.css';
import * as React from "react";

export const Widget = ({title, children, backgroundColor}) => {
    return (
        <Paper className="widget" elevation={10} style={{backgroundColor: backgroundColor, color: '#fff'}}>
            <div className="widget-header">
                <div className="widget-title">{title}</div>
                <div className="widget-button">
                    {/*<IconButton color="primary" aria-label="upload picture" component="label">*/}
                    {/*    <Edit/>*/}
                    {/*</IconButton>*/}
                </div>
            </div>
            <div style={{textAlign: 'center', marginTop: 26}}>
                <div>
                    {children}
                </div>
            </div>
        </Paper>
    )
}
