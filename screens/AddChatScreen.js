import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, Image, View, TouchableOpacity } from "react-native";
import { Icon, Input, Avatar } from "react-native-elements";
import { Dialog } from "@rneui/themed";
import { db } from "../firebase";
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import 'firebase/storage';
import { theme } from "../core/theme";
import Button from "../components/Button";


const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new chat",
      headerBackTitle: "Chats",
    });
  }, [navigation]);

  const createChat = async () => {
    let photoUrl;
    setLoading(true);
    if(!image || !input) {
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 1000);
      setLoading(false)
      return
    } else {
      setError(false); 
    }

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
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              photoUrl = downloadURL
              db.collection('chats').add({
                chatName: input,
                photoUrl: downloadURL
              }).then(() => {
                setLoading(false);
                setSuccess(true)
                setTimeout(() => {
                  setSuccess(false)
                  navigation.goBack();
                }, 2000);
              }).catch((error) => alert(error));
            });
          }
        );

      })
      .catch((error) => {
        console.error(error);
      });


    console.log(photoUrl)

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
    <View style={styles.container}>

      <Dialog isVisible={loading}>
        <Dialog.Loading />
      </Dialog>

      <Dialog isVisible={success} >
        <View style={{justifyContent: 'center', alignItems: 'center' }}>
        <Image style={styles.icon}
        source={require('../assets/icon/success.png')}
        />
        <Text>
        Chat <Text style={{fontWeight: 'bold'}}>{input}</Text> berhasil dibuat
        </Text>
        </View>
      </Dialog>

      <Dialog isVisible={error} >
      <View style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
      <Image style={styles.icon}
      source={require('../assets/icon/warning.png')}
      />
      <Text style={{fontSize: 14, paddingTop: 9}}> 
      Harap menambahkan <Text style={{fontWeight: 'bold'}}>foto & nama</Text> chat!
      </Text>
      </View>
    </Dialog>

      <TouchableOpacity onPress={selectImage} style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 40}}>
      {image ? (<Avatar
        containerStyle={{
          borderWidth: 2,
          borderColor: 'gray',
          borderRadius: 100,
        }}
        size="xlarge"
        rounded
        source={{ uri: image }}
      />) : (<Image style={{width: 100, height: 100}}
          source={require('../assets/icon/uploadimage.png')}
          />)}
     {!image ? (<Text style={{fontWeight: 'bold'}}>
     Upload Image!
     </Text>) : null}
    </TouchableOpacity>

      <Input
        placeholder="Enter a name for the chat"
        value={input}
        onChangeText={(text) => setInput(text)}
        onSubmitEditing={createChat}
        leftIcon={
          <Image style={{width: 34, height: 34}}
          source={require('../assets/icon/chat.png')}
          />
        }
      />
     
      <Button   mode="contained"
      style={styles.chat} onPress={createChat}> 
      Create Chat
      </Button>
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    height: "100%",
  },
  selectImage: {
    width: 310,
    alignSelf: 'center',
    borderRadius: 20,
    borderWidth: 1,
    padding: 10,
    marginBottom: 25,
    color: "white",
    backgroundColor: '#FF6C6C',
    borderColor: "transparent"
  },
  icon: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chat: {
    backgroundColor: `${theme.colors.primary}`,
      borderWidth: 1,
      borderColor: '#fff',
  }
});
