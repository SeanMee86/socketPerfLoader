import React from "react";
import drawCircle from "../utilities/canvasLoadAnimation";

const cpu = (props) => {
    const canvas = Array.from(document.getElementsByClassName(`${props.cpuData.cpuWidgetId}`))[0];
    drawCircle(canvas, props.cpuData.cpuLoad);
    return(
        <div className="col-sm-3 cpu">
            <h3>CPU load</h3>
            <div className="canvas-wrapper">
                <canvas height={'200'} width={'200'} className={props.cpuData.cpuWidgetId}></canvas>
                <div className="cpu-text">{props.cpuData.cpuLoad}%</div>
            </div>
        </div>
    )
};

export default cpu;