import Button from '../components/Button'
import { emailValidator } from '../helpers/emailValidator'
import React, { useState } from "react";
import Background from '../components/Background'
import Header from '../components/Header'
import Logo from '../components/Logo'
import TextInput from '../components/TextInput'
import { theme } from '../core/theme'
import BackButton from '../components/BackButton'






export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })

  const sendResetPasswordEmail = () => {
    const emailError = emailValidator(email.value)
    if (emailError) {
      setEmail({ ...email, error: emailError })
      return
    }
    navigation.navigate('LoginScreen')
  }

  return (
    <Background>
    <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Reset your password.</Header>
      <TextInput
        label="Email"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description="You will receive an email with the reset link."
      />
      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={{ marginTop: 16, backgroundColor: `${theme.colors.primary}`,
        borderWidth: 1,
        borderColor: '#fff' }}
      >
        Continue
      </Button>
    </Background>
  )
}