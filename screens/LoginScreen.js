import React, { useState, useEffect, useContext } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import { auth } from "../firebase";
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import {
  Dialog,
} from '@rneui/themed';
import { UtilsContext } from "../context/UtilsContext";


const LoginScreen = ({ navigation, keyboardShown }) => {
  const [loading, setloading] = useState(false);
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  // trigger modal error custom.
  const [visible, setVisible] = useState(false)
  const [errMassage, setErrMassage] = useState("")


  const onLoginPressed = async () => {
    setloading(true);
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    auth
      .signInWithEmailAndPassword(email.value, password.value)
      .then(() => {
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        setVisible(true);
        setErrMassage(error?.message)
      });
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    });
  }

  const { show } = useContext(UtilsContext);

  useEffect(() => {
    console.log(show)
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home");
      }
    });

    return unsubscribe;
  }, []);


  return (
    <Background>
      <Dialog
        isVisible={visible}
        onBackdropPress={() => setVisible(false)}
      // backdropStyle={{ backgroundColor: 'lightpink' }}
      // overlayStyle={{ borderRadius: 16, borderWidth: 1, backgroundColor: 'black', borderColor: 'gold' }}
      >
        <View style={styles.warning}>
          <Text style={styles.errorTitle}>Error Occures</Text>
          <Image style={styles.icon} source={require('../assets/icon/alert.png')} />
          <Text style={styles.errorMessage}>{errMassage}</Text>
        </View>
      </Dialog>
      <Dialog isVisible={loading}>
        <Dialog.Loading />
      </Dialog>
      <BackButton goBack={navigation.goBack} menus={85} />
      <Logo />
      <Header>{keyboardShown}</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Reset Password')}
        >
          <Text style={styles.forgot}>Forgot your password ?</Text>
        </TouchableOpacity>
      </View>
      <Button
        onPress={onLoginPressed}
        style={styles.loginScreenButton}
        mode="contained"
      >
        Login
      </Button>

      <View style={styles.row}>
        <Text>You do not have an account yet ?</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.replace('Register')}>
          <Text style={styles.link}>Create !</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: `${theme.colors.primary}`,
  },
  loginScreenButton: {
    backgroundColor: `${theme.colors.primary}`,
    borderWidth: 1,
    borderColor: '#fff'
  },
  warning: {
    justifyContent: 'center', alignItems: 'center',
  },
  icon: {
    width: 60,
    height: 60,
    justifyContent: 'center', alignItems: 'center',
  },
  errorMessage: {
    paddingTop: 10,
    textAlign: 'center',
  },
  errorTitle: {
    fontWeight: "bold",
    color: `${theme.colors.primary}`,
    paddingBottom: 10,
  }
});
