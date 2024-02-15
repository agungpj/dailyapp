import React, { useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView
} from "react-native";
import { db, auth } from "../firebase";
import * as ImagePicker from 'expo-image-picker';
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import {
  Dialog,
} from '@rneui/themed';



const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  // trigger modal error custom.
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [errMassage, setErrMassage] = useState("")
  const [image, setImage] = useState(null);

  const onSignUpPressed = () => {

  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Login",
    });
  }, [navigation]);


  const createUser = async () => {

  };

  const register = async () => {
    setLoading(true);
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    await db.collection('users').add({
      name: name.value,
      email: email.value
    }).then((data) => {
      console.log(data, "datanya")
    }).catch((error) => {
      alert(error);
      return
    });


    auth
      .createUserWithEmailAndPassword(email.value, password.value)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: name.value,
          photoURL: image,
        }).then(() => {
          setLoading(false);
        })

      })
      .catch((error) => {
        setLoading(false);
        setVisible(true);
        setErrMassage(error?.message)

      });
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    });

  };

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result)

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };


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
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Welcome{name.value ? ', ' + name.value : ""}</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
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
      {/* <TouchableOpacity style={styles.selectImage} onPress={selectImage}>
      <View style={styles.headImage}>
      <Text style={styles.uploadText}>Upload </Text>
      <Text style={{fontWeight: 'bold', color: `${theme.colors.primary}`}}>Image!</Text>
      </View>
      <Image style={styles.upload} source={require('../assets/icon/upload.png')} />
      
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </TouchableOpacity> */}

      <Button
        mode="contained"
        style={styles.register}
        onPress={register}
      >
        Next
      </Button>
      <View style={styles.row}>
        <Text>I already have an account !</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.link}>Log in</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   paddingTop: StatusBar.currentHeight,
  // },
  // scrollView: {
  //   backgroundColor: 'pink',
  // }, 
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: `${theme.colors.primary}`,
  },
  register: {
    backgroundColor: `${theme.colors.primary}`,
    borderWidth: 1,
    borderColor: '#fff'
  },
  headImage: {
    borderColor: "transparent",
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectImage: {
    justifyContent: 'center', alignItems: 'center',
  },
  upload: {
    width: 80,
    height: 80,
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

})