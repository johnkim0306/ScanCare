import React, { useEffect, useState } from 'react'

const Refrigerator = () => {
    return (
    <div className="fridge">
        <div className="fridge-body">
        <div className="handle top"></div>
        <div className="handle bottom"></div>
        <div className="divider"></div>
        <div className="hightlight top"></div>
        <div className="hightlight bottom"></div>
        <div className="shadow-bottom"></div>
        </div>
        <div className="fridge-shadow"></div>
    </div>
    )
}

export default Refrigerator