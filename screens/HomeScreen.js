import React, { useEffect, useState } from "react";
import { View, Image, ScrollView, TouchableOpacity, StyleSheet, Text, InteractionManager } from "react-native";
import { Avatar, Tab, TabView, Dialog } from "@rneui/themed";
import { LongPressGestureHandler, State } from "react-native-gesture-handler";
import Animated, { Easing } from "react-native-reanimated";
import CustomListItem from "../components/CustomListItem";
import { auth, db } from "../firebase";
import { theme } from "../core/theme";
import * as firebase from 'firebase';


const HomeScreen = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [chatsname, setChatsname] = useState('');
  const [userLogin, setUserLogin] = useState(null);

  const opacity = new Animated.Value(0);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    Animated.timing(opacity, {
      toValue: isVisible ? 0 : 1,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    }).start();
  };

  const handleLongPress = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      setVisible(true);
    }
  };

  const deleteChat = async (id) => {
    try {
      setLoading(true);
      setVisible(false);
      await db.collection("chats").doc(id).delete();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true)
    const user = firebase.auth().currentUser;
    const chatsData = db.collection("chats").onSnapshot((snapshot) => {
      console.log(snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      })))
      setChats(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
        );
        // console.log(chats.map(()), "chatnya")
        chats.map(({id}) => {
          console.log(id, "idnya")
        })
      setLoading(false)
    });

    navigation.setOptions({
      title: "N/A",
      headerStyle: { backgroundColor: "#93a58d" },
      headerTitleStyle: { color: "white" },
      headerTintColor: "white",
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
        <TouchableOpacity  onPress={() => navigation.navigate('Profile')}>
        {user.photoURL ? <Avatar  containerStyle={{
          borderWidth: 1,
          borderColor: 'white',
          borderRadius: 100,
        }}
        rounded source={{ uri: user?.photoURL }} /> : <Avatar source={require('../assets/icon/profile2.png')} />}
        </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            marginRight: 20,
            flexDirection: "row",
            width: 70,
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity activeOpacity={0.5}></TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Contact")}
            activeOpacity={0.5}
          >
            <Avatar source={require('../assets/icon/addchat.png')} />
          </TouchableOpacity>
        </View>
      ),
    });

    return () => {
      chatsData();
    };
  }, [isVisible, navigation, isVisible]);

  const enterChat = (id, chatName, photoURL) => {
    isVisible
      ? setIsVisible(false)
      : navigation.navigate("Chat", {
        id: id,
        chatName: chatName,
        photoURL,
      });
  };

  return (
    <View style={{ flex: 1, }}>
   
      <TabView
        value={index}
        onChange={setIndex}
        animationType="spring"
        style={{
          flex: 1, justifyContent: 'center',
          alignItems: 'center',
        }}
      >
      
        <TabView.Item style={{ width: '100%' }}>
        
          <ScrollView style={styles.container}>
          
            {chats.map(({ id, data: { chatName, photoUrl } }) => (
              <LongPressGestureHandler
                key={id}
                onHandlerStateChange={handleLongPress}
                minDurationMs={400}
              >
                <View>
                  <Dialog
                    isVisible={visible}
                    onBackdropPress={() => setVisible(false)}
                  >
                    <View style={styles.warning}>
                      <Text style={styles.errorTitle}>
                        Hapus chat {id}?
                      </Text>
                      <Image
                        style={styles.icon}
                        source={require('../assets/icon/bin.png')}
                      />
                      <Dialog.Actions>
                        <View style={{ paddingLeft: 80 }}>
                          <Dialog.Button
                            titleStyle={{ color: 'red' }}
                            title="Hapus chat"
                            onPress={() => deleteChat(id)}
                          />
                        </View>
                        <Dialog.Button
                          titleStyle={{ color: 'gray' }}
                          title="Batal"
                          onPress={() => setVisible(false)}
                        />
                      </Dialog.Actions>
                    </View>
                  </Dialog>
                  <Dialog isVisible={loading}>
                    <Dialog.Loading />
                  </Dialog>
                  <CustomListItem
                    id={id}
                    key={id}
                    chatName={chatName}
                    photoURL={photoUrl}
                    check={isVisible}
                    enterChat={() => enterChat(id, chatName, photoUrl)}
                    onDelete={() => deleteChat(id)}
                  />
                </View>
              </LongPressGestureHandler>
            ))}
          </ScrollView>
        </TabView.Item>
        <TabView.Item style={{ width: '100%' }}>
          <Text h1>Page 2</Text>
        </TabView.Item>
        <TabView.Item style={{ width: '100%' }}>
          <Text h1>Page 4</Text>
        </TabView.Item>
      </TabView>

      <Tab
        iconPosition={'bottom'}
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
          backgroundColor: 'white',
          height: 3,
        }}
      >
        <Tab.Item
          title="Chat"
          titleStyle={{ fontSize: 12, color: 'black' }}
          icon={<Image style={{ width: 35, height: 35 }} source={require('../assets/icon/chat.png')} />}
        />
        <Tab.Item
          title="Promise"
          titleStyle={{ fontSize: 12, color: 'black' }}
          icon={<Image style={{ width: 35, height: 35 }} source={require('../assets/icon/calendar.png')} />}
        />
      </Tab>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    maxHeight: "100%",
  },
  icon: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warning: {
    justifyContent: 'center',
    alignItems: 'center',
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
