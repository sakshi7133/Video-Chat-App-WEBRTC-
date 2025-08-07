import React,{useEffect,useCallback,useState} from "react";
import {useSocket} from "../providers/socket";
import {usePeer} from "../providers/peer";
import ReactPlayer from 'react-player';
const Roompage=()=>{
    const{socket}=useSocket();
    const{peer,createOffer,createAnswer,setRemoteAnswer,sendStream}=usePeer();

    const[myStream,setMyStream]= useState(null);
    const handleNewUserJoined=useCallback(async (data)=>{
        const {emailId}=data;
        console.log("new user joined",emailId);
        console.log(peer.constructor.name); 
        const offer= await createOffer(); 
        socket.emit('call-user',{emailId,offer}); 
    },[createOffer,socket]);

    const handleIncomingCall=useCallback(async(data)=>{
        const {from,offer}= data;
        console.log('incoming call from',from,offer);
        const userConfirmed = window.confirm(`Accept call from ${from}?`);
        if (!userConfirmed) {
            console.log("User declined the call");
            return; // Do nothing if the user rejects the call
        }
        const ans= await createAnswer(offer);
        socket.emit('call-accepted',{emailId:from,ans});
    },[createAnswer,socket]);
    
    const handleCallAccepted=useCallback(async(data)=>{
        const {ans}=data;
        console.log("call got accepted",ans)
        await setRemoteAnswer(ans);
    },[setRemoteAnswer]);

    const getUserMediaStream=useCallback(async()=>{
        const stream=await navigator.mediaDevices.getUserMedia({audio: true,video:true})
        sendStream(stream)
        setMyStream(stream);
    },[])
    useEffect(()=>{
        socket.on('user-joined',handleNewUserJoined)
        socket.on('incoming-call',handleIncomingCall)
        socket.on("call-accepted",handleCallAccepted)
       
        return()=>
    {
        socket.off("user-joined",handleNewUserJoined);
        socket.off("incoming-call",handleIncomingCall);
        socket.off("call-accepted",handleCallAccepted);
    };

     },[socket,handleNewUserJoined,handleIncomingCall,handleCallAccepted]);
    useEffect(()=>{
        getUserMediaStream();
    })
     return (
    <div className="room-page-container">
        <h1>Room Page</h1>
        <ReactPlayer url={myStream}playing muted M />
    </div>
);
};
export default Roompage;