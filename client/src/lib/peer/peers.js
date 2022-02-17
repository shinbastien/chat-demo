import React from "react";
import Peer from "simple-peer";


function createPeer(roomName, userName, participants, socket) {
    const newPeers = {}

    Object.keys(participants)
    .filter((participantName) => participantName != userName)
    .forEach((participantName) => {
        console.log("gained user name: ", participantName);

        const peer = new Peer({
            initiator: true,
            trickle: false,
        })

        peer.on("signal", (signal) => {
            socket.emit("RTC_offer", signal, userName, participantName, roomName)
            console.log("Offered RTC signal");
            // socket.emit("sending signal", participants[participant].socket, participant, socket.id, userName, signal)
        })

        peer.on("connect", () => {
            console.log("connected");
        })
    
        // peer.on("stream", (stream) => {
        //     peerStreams[participantName] = stream;

        // })

        peer.on("error", (err) => {
            console.log(err);
        })

        console.log("create Peer of: ", participantName);

        newPeers[participantName] = {peer: peer, hasstream: false};
    });

    return newPeers
}


function addPeer(roomName, userName, participants, peers, socket) {
    let oldPeers = Object.keys(peers);
    let newPeers = Object.keys(participants);

    let newUser = newPeers.filter((x) => !oldPeers.includes(x) && x!= userName)[0];

    const peer = new Peer({
        initiator: false,
        trickle: false,
    });

    // send returning signal from: existing to: newbie
    peer.on("signal", (signal) => {
        socket.emit("RTC_offer", signal, userName, newUser, roomName);
    });
    console.log(`${userName} adds Peer of : ${newUser}`);
    
    peer.on("connect", () => {
        console.log("connected");
    })

    // peer.on("stream", (stream) => {
    //     peerStreams[newUser] = stream;
    // })

    peer.on("error", (err) => {
        console.log(err);
    })

    return {...peers, [newUser]: {peer: peer, hasstream: false}};
}

function disconnectPeer(peers, userName) {
    const newPeers = {};
    Object.keys(peers).filter((peerName) => peerName != userName).forEach((peerName) => {
        newPeers[peerName] = peers[peerName];
    })
    return newPeers;
}

function PeeraddStream(peers, mystream) {
    const newPeers = {};
    Object.keys(peers).forEach((participantName) => {
        if (!peers[participantName].hasstream) {
            newPeers[participantName] = {peer: peers[participantName].peer, hasstream: true};
            newPeers[participantName].peer.addStream(mystream);
            console.log(mystream);
        }
        else {
            newPeers[participantName] = peers[participantName];
            console.log("already has stream");
        }
    })

    return newPeers;
}

export {addPeer, createPeer, disconnectPeer, PeeraddStream};