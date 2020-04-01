// The node program that captures local performance data
// and sends it up to the socket.io server
// Req:
// - farmhash
// - socket.io-client

const os = require('os');
const io = require('socket.io-client');
let socket = io('http://127.0.0.1:8181');

socket.on('connect', () => {
    // we need a way to identify this machine to whomever is concerned
    const nI = os.networkInterfaces();
    let macA;
    for(let key in nI){
        // macA = Math.floor(Math.random()*3)+1;
        if(!nI[key][0].internal){
            if(nI[key][0].mac === '00:00:00:00:00:00'){
                macA = Math.random().toString(36).substr(2,15)
            }else {
                macA = nI[key][0].mac;
            }
            break;
        }
    }
    // client auth with single key value
    socket.emit('clientAuth', 'k23u4h5k2j3h54');

    socket.initPerfData = true;

    // start sending data on interval
    let perfDataInterval = setInterval(()=> {
        performanceData()
            .then(allPerfData => {
                if(socket.initPerfData){
                    allPerfData.macA = macA;
                    socket.emit('initPerfData', allPerfData);
                    socket.initPerfData = false;
                }else{
                    allPerfData.macA = macA;
                    socket.emit('perfData', allPerfData);
                }
            });
    }, 1000);

    socket.on('disconnect', () => {
        clearInterval(perfDataInterval);
    })
});



const performanceData = () => {
    return new Promise(async (resolve) => {
        const cpus = os.cpus();
        // What do we need to know from node about performance
        // - CPU load (current)
        // - Memory Usage
        // - free
        const freeMem = os.freemem();
        // - total
        const totalMem = os.totalmem();
        const usedMem = totalMem - freeMem;
        const memUsage = Math.floor(usedMem / totalMem * 100) / 100;
        // - OS type
        const osType = os.type();
        // - uptime
        const upTime = os.uptime();
        // - CPU Info
        // - Type
        const cpuModel = cpus[0].model;
        // - Number of Cores
        const numCores = cpus.length;
        // - Clock Speed
        const cpuSpeed = cpus[0].speed;
        const cpuLoad = await getCpuLoad();
        const isActive = true;
        resolve({
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
            isActive
        })
    })
};

// cpus is all cores. we need the average of all the cores which will give us the cpu average
const cpuAverage = () => {
    const cpus = os.cpus();
    // Get ms in each mode, but this number is since reboot
    // so get it now, and get it in 100ms and compare
    let idleMs = 0;
    let totalMs = 0;
    let user = 0, nice = 0, sys = 0, idle = 0, irq = 0;
    cpus.forEach((aCore) => {
        // loop through each property of the current core
        for(let type in aCore.times){
            totalMs += aCore.times[type];
        }
        idleMs += aCore.times.idle
    });
    return {
        idle: idleMs / cpus.length,
        total: totalMs / cpus.length
    }
};

// because the times property is time since boot, we will get
// now times, and 100ms from now times.  Compare them, that will
// give us current Load
const getCpuLoad = () => {
    return new Promise((resolve) => {
        const start = cpuAverage();
        setTimeout(() => {
            const end = cpuAverage();
            const idleDifference = end.idle - start.idle;
            const totalDifference = end.total - start.total;
            // console.log(idleDifference, totalDifference)
            // calc the % of used cpu
            const percentageCpu = 100 - Math.floor(100 * idleDifference / totalDifference);
            resolve(percentageCpu)
        }, 100);
    })
};


