import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import { StyleSheet } from 'react-native'
import { theme } from '../core/theme'


export default function StartScreen({ navigation }) {
  return (
    <Background>
      <Logo />
      <Header>Build by Agung Prasetya</Header>
        <Paragraph>
          Masih dummy ya guys!
        </Paragraph>
      <Button
        mode="contained"
        style={styles.menu}
        onPress={() => navigation.navigate('Login')}
      >
        Log in
      </Button>
      <Button
        mode="contained"
        style={styles.menu}
        onPress={() => navigation.navigate('Register')}
      >
        Create an account
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
    menu: {
      backgroundColor: `${theme.colors.primary}`,
        borderWidth: 1,
        borderColor: '#fff',
    }
  })