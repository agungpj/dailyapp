import React, {useEffect, useState, useContext } from 'react'
import { Keyboard, Text } from 'react-native';
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { UtilsContext } from '../context/UtilsContext';


export default function BackButton({ goBack, keyboardShown }) {

  const { show } = useContext(UtilsContext)

  const imageStyle = {
    opacity: show ? 0 : 100,
    width: 50,
    height: 50,
  } 

  return (
    <TouchableOpacity onPress={goBack} style={styles.container}>
      <Image
        style={imageStyle}
        source={require('../assets/icon/back.png')}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10 + getStatusBarHeight(),
    left: 0,
  },
 
})
