import React from "react";
import drawCircle from "../utilities/canvasLoadAnimation";

const mem = (props) => {
    const {totalMem, memUsage, freeMem} = props.memData;
    const canvas = Array.from(document.getElementsByClassName(`${props.memData.memWidgetId}`))[0];
    drawCircle(canvas, memUsage*100);
    const totalMemInGB = Math.floor(totalMem/1073741824 * 100)/100;
    const freeMemInGB = Math.floor(freeMem/1073741824 * 100)/100;

    return(
        <div className="col-sm-3 mem">
            <h3>Memory</h3>
            <div className="canvas-wrapper">
                <canvas width={'200'} height={'200'} className={props.memData.memWidgetId}></canvas>
                <div className="mem-text">{Math.floor(memUsage*100)}%</div>
            </div>
            <div>
                Total Memory: {totalMemInGB}gb
            </div>
            <div>
                Free Memory: {freeMemInGB}gb
            </div>
        </div>
    )
};

export default mem;