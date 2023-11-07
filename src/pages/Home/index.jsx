import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { nanoid } from '@reduxjs/toolkit';
import axios from "axios";
import { setToInitial, toggleDevice, setStatus, setDeviceId, fullResetDevice } from "../../data/redux/deviceSlice";
import { clientAdded, selectAllClients } from "../../data/redux/eidSlice";
import { getDeviceById, checkConnection } from "../../data/firebase/firestore/getData";
import { createDevice, addClient } from "../../data/firebase/firestore/saveData";

import './Home.scss';

function Home() {
  const dispatch = useDispatch();

  const deviceStatus = useSelector((state) => state.device.status);
  const deviceData = useSelector((state) => state.device.data);
  const clients = useSelector((state) => state.eid.clients);
  const [coupezaId, setCoupezaId] = useState(false);
  //txt, type:[scan_id, scan_card, device], data, light:[error, scan_id, on, ok, loading]

  const initDevice = () => {
    setTimeout(()=>{
      dispatch(setToInitial());
    }, 1500);
  }

  const scanId = () => {
    if(deviceStatus.on && deviceStatus.id){
      dispatch(setStatus('SCANNING ID...', 'scan_id', {}, 'scan_id'));
      axios.get("https://randomuser.me/api/?inc=gender,name,nat,picture,email,location,dob").then((response) => {
        let user = response.data.results[0];
        addClient(user);
        console.log(user);
        setTimeout(()=>{
          dispatch(setStatus('Welcome '+user.name.first, 'scan_id', {}, 'ok'));
          dispatch(clientAdded(user.name.first, user.name.last, user.gender, user.location, user.picture.large));
          initDevice();
        }, 1000);
      });
    } else {
      alert('Please put on device first and do set up');
    }
  }

  const setupDevice = () => {
    const coupeza_device_id = localStorage.getItem("coupeza_device_id");
    if(!localStorage.getItem("coupeza_temp_id")){
      let temp_id = Math.floor(Math.random() * 1000000) + 100000;
      localStorage.setItem("coupeza_temp_id", temp_id);
    }
    let coupeza_temp_id = localStorage.getItem("coupeza_temp_id");
    dispatch(setStatus('Device ID : '+coupeza_temp_id, 'device', {}, 'on'));
    console.log('1');
    getDeviceById(coupeza_device_id, (callback) => {
      console.log('2');
      if(callback){
        checkConnection(coupeza_device_id, (callback) => {
          console.log('3');
          if(callback.connected){
            if(!deviceStatus.id){
              console.log('4');
              dispatch(setStatus('Device connected', 'device', {}, 'on'));
            }
            dispatch(setDeviceId(coupeza_device_id));
            localStorage.removeItem('coupeza_temp_id');
            setTimeout(() => {
              console.log('5');
              dispatch(setStatus(false, 'device', {}, 'on'));
            }, 2000);
          }
        })
      } else {
        createDevice(coupeza_device_id, coupeza_temp_id);
        setupDevice();
      }
    });
  }

  const resetDevice = () => {
    if (window.confirm("Are you sure you want to reset device?")) {
      dispatch(fullResetDevice());
      localStorage.removeItem('coupeza_temp_id');
      localStorage.removeItem('coupeza_device_id');
    } 
  }

  useEffect(() => {
    if(deviceStatus.on && !deviceStatus.id){
      if(!localStorage.getItem("coupeza_device_id")){
        let coupeza_device_id = nanoid();
        localStorage.setItem("coupeza_device_id", coupeza_device_id);
        setCoupezaId(coupeza_device_id);
      }
      setupDevice();
    }
  }, [deviceStatus]);

  useEffect(() => {
    if(!coupezaId && localStorage.getItem("coupeza_device_id")){
      setCoupezaId(localStorage.getItem("coupeza_device_id"));
    }
    if(coupezaId){
      console.log(coupezaId);
      checkConnection(coupezaId, (callback) => {
        if(callback.name !== deviceStatus.name){
          dispatch(setStatus(callback.name, 'device', {}, 'scan_id'));
          setTimeout(()=> {
            initDevice();
          }, 2000);
        }
        console.log(callback);
      })
    }
  }, [coupezaId]);

  return (
    <div id="home">
      <div id="reset" onClick={ () => resetDevice() } />
      <div id="on-off" onClick={ () => dispatch(toggleDevice()) }><div  className={ deviceStatus.on ? 'toggle on' : 'toggle off' }></div></div>
      <div id="homebase">
        <div id="display">{ deviceData.txt }</div>
        <div className={ `status`+(deviceStatus.light === 'error' ? ' active' : '' ) }  id="status-red"></div>
        <div className={ `status`+(deviceStatus.light === 'ok' ? ' active' : '' ) }  id="status-green"></div>
        <div className={ `status`+(deviceStatus.light === 'scan_id' ? ' active' : '' ) }  id="status-blue"></div>
        <div className={ `status`+(deviceStatus.light === 'on' ? ' active' : deviceStatus.light === 'loading' ? ' loading' : '' ) }  id="status-white"></div>
      </div>
      <div id="eid" onClick={ () => scanId() } className={ (deviceData.type === 'scan_id') ? 'active' : ''}></div>
      <div id="cards">
        <div className={ `card ` +((deviceData.type === 'scan_card') ? 'active' : '') } />
        <div className={ `card ` +((deviceData.type === 'scan_card') ? 'active' : '') } />
        <div className={ `card ` +((deviceData.type === 'scan_card') ? 'active' : '') } />
      </div>
    </div>
  );
}

export default Home;
