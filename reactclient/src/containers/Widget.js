import React from "react";
import Cpu from '../components/Cpu'
import Mem from '../components/Mem'
import Info from '../components/Info'
import './widget.css';

const widget = (props) => {

    const {
        freeMem,
        totalMem,
        usedMem,
        memUsage,
        osType,
        upTime,
        cpuModel,
        numCores,
        cpuSpeed,
        cpuLoad,
        macA,
        isActive
    } = props.data;

    const cpuWidgetId = `cpu-widget-${macA}`;
    const memWidgetId = `mem-widget-${macA}`;

    const cpu = {cpuLoad, cpuWidgetId};
    const mem = {totalMem, usedMem, memUsage, freeMem, memWidgetId};
    const info = {macA, osType, upTime, cpuModel, numCores, cpuSpeed};
    let notActiveDiv;
    notActiveDiv = !isActive ? <div className={'not-active'}>Offline</div> : null;

    return (
        <div className={'widget col-sm-12'}>
            {notActiveDiv}
            <Cpu cpuData={cpu}/>
            <Mem memData={mem}/>
            <Info infoData={info}/>
        </div>

    )
};

export default widget;