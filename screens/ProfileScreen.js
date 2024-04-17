import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView
} from "react-native";
import * as firebase from 'firebase';
import 'firebase/storage';

import { db, auth } from "../firebase";
import * as ImagePicker from 'expo-image-picker';
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'
import { theme } from '../core/theme'

import {
  Dialog,
} from '@rneui/themed';
import { Avatar } from "react-native-elements";



const ProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [errMassage, setErrMassage] = useState("")
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [userLogin, setUserLogin] = useState(null);


  useEffect(() => {
    setLoading(true);
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      setUserLogin(user);
      console.log(user);
      setLoading(false)
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const register = async () => {
    try {
      setLoading(true)
      uriToBlob(image)
        .then((blob) => {
          // Tampilkan informasi blob di konsol
          const filename = image.substring(image.lastIndexOf('/') + 1);
          const storageRef = firebase.storage().ref().child(`images/${filename}`);
          const uploadTask = storageRef.put(blob);

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              console.error(error);
              setLoading(false);
            },
            () => {
              uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);
                const user = firebase.auth().currentUser;
                if (user) {
                  user.updateProfile({
                    photoURL: downloadURL,  // URL foto profil baru
                  })
                }  
                setLoading(false);
                // Lakukan sesuatu dengan URL download
              });
            }
          );


          // Contoh: Upload blob ke Firebase Storage atau melakukan operasi lainnya
        })
        .catch((error) => {
          console.error(error);
        });


      setLoading(false);
    } catch (err) {
      console.log(err)
    }
  };

  const logout = () => {
    auth.signOut().then(() => {
      navigation.replace("MenuScreen");
    });
  };


  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uriToBlob = async (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onload = function () {
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        reject(new Error('uriToBlob failed'));
      };

      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  };

  return (
    <Background>
      <Dialog isVisible={loading}>
        <Dialog.Loading />
      </Dialog>
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

      <TouchableOpacity onPress={selectImage}>
      {userLogin && userLogin?.photoURL && !image ? (<Avatar
        containerStyle={{
          borderWidth: 4,
          borderColor: `${theme.colors.primary}`,
          borderRadius: 100,
        }}
        size="xlarge"
        rounded
        source={{ uri: userLogin?.photoURL }}
      />) : userLogin && userLogin?.photoURL && image ? (<Avatar
        containerStyle={{
          borderWidth: 2,
          borderColor: 'gray',
          borderRadius: 100,
        }}
        size="xlarge"
        rounded
        source={{ uri: image }}
      />) : (<Avatar
        containerStyle={{
          borderWidth: 2,
          borderColor: 'gray',
          borderRadius: 100
        }}
        size="xlarge"
        source={require('../assets/icon/profile2.png')}
      />)}
      </TouchableOpacity>
      <Header>{userLogin && userLogin?.displayName}</Header>
      <Button
        mode="contained"
        style={styles.register}
        onPress={register}
      >
        Save
      </Button>
  
    </Background>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
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
  logout: {
    backgroundColor: `#faf`,
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