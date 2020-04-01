const mongoose = require('mongoose');
const {mongoUri} = require('./dbKey');
mongoose
    .connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(res => res);
const Machine = require('./models/Machine');

function socketMain(io, socket){
    let macA;

    socket.on('clientAuth', key => {
        if (key === 'k23u4h5k2j3h54'){
            // valid nodeClient
            socket.join('clients');
        }else if(key === 'oiasunpmdasdf89898'){
            // valid ui client has joined
            socket.join('ui');
            Machine.find({}, (err, docs) => {
                docs.forEach(aMachine => {
                    aMachine.isActive = false;
                    io.to('ui').emit('data', aMachine);
                })
            })
        }else {
            // an invalid client has joined. Goodbye
            socket.disconnect(true);
        }
    });

    socket.on('disconnect', () => {
        Machine.find({macA}, (err, docs) => {
            if (docs.length > 0){
                // send one last emit to React
                docs[0].isActive = false;
                io.to('ui').emit('data', docs[0]);
            }
        })
    });

    // a machine has connected, check to see if it's new.
    // if it is, add it!
    socket.on('initPerfData', async data => {
        macA = data.macA;
        const mongooseResponse = await checkAndAdd(data);
        console.log(mongooseResponse);
    });

    socket.on('perfData', data=> {
        console.log('tick...');
        io.to('ui').emit('data', data);
    })
}

function checkAndAdd(data){
    // because we are doing db stuff we need a promise
    return new Promise((resolve) => {
        Machine.findOne(
            {macA: data.macA},
            (err, doc) => {
                if(err){
                    throw err;
                }else if(doc === null){
                    // the record is not in the db so add it
                    let newMachine = new Machine(data);
                    newMachine.save();
                    resolve('added');
                }else{
                    resolve('found');
                }
            }
        )
    })
}

module.exports = socketMain;