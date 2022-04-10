import React from 'react'
import './style.css'
const Loading = () => {

    return (
        <div className="loadingContainer">
            <svg className="loadingSvg" width="200" height="200" id="svg">
            <circle id="dot1" className="loadingShape" />
            <circle id="dot2" className="loadingShape" />
            <circle id="dot3" className="loadingShape" />
            <circle id="dot4" className="loadingShape" />
            </svg>
        </div>
    )
}



export default Loading
