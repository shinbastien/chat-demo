import React, { useState, useEffect, useRef } from "react";
import { useSocket } from '../lib/socket';
import {useLocation} from "react-router-dom";
import VideoCall from "../VideoCall/VideoCall";
import Peer from "simple-peer";
import styled from "styled-components";
import { StyledVideo, Video, videoConstraints } from "../VideoCall/videostyle";

const Container = styled.div`
    display: flex;
    width: 100%;
    height: 100vh;
    flex-direction: row;
`;

const LeftRow = styled.div`
    width: 40%;
    height: 100%;
`;

const RightRow = styled.div`
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

// const Video = styled.video`
//     height: 50%;
//     width: 100%;
//     border: 1px solid black;
// `;


function ShareVideo () {
    const {socket, connected} = useSocket();
    const youtubePlayer = useRef();
    const userVideo = useRef();
    const [videoID, setVideoID] = useState("");
    const [peers, setPeers] = useState([]);
    const location = useLocation();
	const {GroupID, userName}= location.state;
    console.log("groupID obtained from Home is: ", GroupID);
	console.log("userName obtained from Home is: ", userName);


    useEffect(() => {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = loadVideoPlayer;
        console.log("prepare youtube player", window.onYoutubeIframeAPIReady);
    }, [])

    useEffect(() => {
        if (connected) {
            socket.emit("join group", {GroupID: GroupID, userName: userName});
            console.log("joining group in ShareVideo"); 
        }

        socket.emit("start shareVideo", GroupID);
        socket.on("ShareVideoAction", (data) => {
            handleVideo(data);
        });
    }, [socket])


    function loadVideoPlayer() {
        const player = new window.YT.Player('player', {
            height: '390',
            width: '640',
            playerVars: { 
                'playsinline': 1,
                'autoplay': 1,
                'controls': 0,
                'autohide': 1,
                'wmode': 'opaque',
                "origin": "https://www.youtube.com"
            },
        });
        console.log("player is: ", player);
        youtubePlayer.current = player;
    }

    function stopVideo() {
        // peersRef.current.forEach((item) => {
        //     item.peer.send(JSON.stringify({type: "pause"}));
        // })
        socket.emit("pause", GroupID);
        youtubePlayer.current.pauseVideo();

    }

    function playVideo() {
        // peersRef.current.forEach((item) => {
        //     item.peer.send(JSON.stringify({type: "play"}));
        // })
        socket.emit("play", GroupID);
        youtubePlayer.current.playVideo();
    }

    function loadVideo() {
        // peersRef.current.forEach((item) => {
        //     item.peer.send(JSON.stringify({type: "newVideo", data: videoID}));
        // })
        socket.emit("load", [GroupID, videoID]);
        youtubePlayer.current.loadVideoById(videoID.split("=")[1]);
    }

    function handleVideo(data) {
        if (data === "play"){
            console.log("play video");
            youtubePlayer.current.playVideo();
        } else if (data === "pause") {
            console.log("pause video");
            youtubePlayer.current.pauseVideo();
        } else {
            console.log("load video: ", data);
            youtubePlayer.current.loadVideoById(data.split("=")[1]);
            
        }
    }

    return (
        <Container>
            <LeftRow>
                <VideoCall groupID = {GroupID} userName={userName}> </VideoCall>
            </LeftRow>

            <RightRow>
                <div id="player" />
                <button onClick={stopVideo}>Stop Video</button>
                <button onClick={playVideo}>Play Video</button>
                <input type="text" placeholder="video link" value={videoID} onChange={e => setVideoID(e.target.value)} />
                <button onClick={loadVideo}>Load video</button>
            </RightRow>
        </Container>
    )
}
export default ShareVideo;