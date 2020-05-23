import React from 'react';
import { Hello } from './Hello.jsx';
import { Info } from './Info.jsx';

export const App = () => {

  if(Meteor.isDesktop){
    // console.log('desktop')
    /* const electron = require('electron')
    electron.ipcRenderer.on('asynchronous-message', (event, arg) => {
      console.log(arg)
    }) */
    /* Desktop.fetch('deep-link', 'init').then((d)=> {
        console.log(d)
      }).catch((e)=> {
        console.log(e)
      }) */
    Desktop.once('deep-link', 'challegeCode', (event, arg) => {
      console.log('challegeCode', arg)
    })
  } else {
    const secret = 'jimmy-cliff'
    window.open(`meteordemo://${secret}`)
  }

  return (
  <div>
    <h1>Welcome to Meteor!</h1>
    <Hello/>
    <Info/>
  </div>
)};
