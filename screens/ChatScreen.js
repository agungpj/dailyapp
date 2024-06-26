import React, { useLayoutEffect, useRef, useState, useEffect} from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import { Avatar } from "react-native-elements";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { LongPressGestureHandler, State } from "react-native-gesture-handler";
import { Keyboard } from "react-native";
import { db, auth } from "../firebase";
import * as firebase from "firebase";
import { theme } from "../core/theme";

const ChatScreen = ({ navigation, route, chatName, photoURL }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleLongPress = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      // setVisible(true);
      console.log("long press")
    }
  };

  const sendMessage = () => {
    Keyboard.dismiss();

    if (input && input !== "\n") {
      db.collection("chats").doc(route.params.id).collection("messages").add({
        timestamp: firebase.default.firestore.FieldValue.serverTimestamp(),
        message: input,
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        photoURL: auth.currentUser.photoURL,
      });
    }

    setInput("");

    scrollDownFunc();
  };

  const scrollDownDelayed = () => {
    setTimeout(function(){
      scrollDownFunc();
    }, 35);
  }

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );

    scrollDownDelayed();

    return unsubscribe;
  }, [route]);

  const scrollDown = useRef();

  const scrollDownFunc = () => {
    scrollDown.current.scrollToEnd();
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar
            rounded
            source={{
              uri:
            route.params.photoURL
            ||
                "https://censur.es/wp-content/uploads/2019/03/default-avatar.png",
            }}
          />
          <Text style={{ color: "black", marginLeft: 10,  }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 70,
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
          </TouchableOpacity>
        </View>
      ),
    });
    scrollDownFunc();
  }, [navigation, messages]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={85}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView ref={scrollDown}
              contentContainerStyle={{
                paddingTop: 15,
                flexDirection: "column-reverse",
              }}
            >
              {messages.map(({ id, data }) =>
                data.email === auth.currentUser.email ? (
                  <View key={id} style={styles.sender}>
                    {data?.photoURL ?  (<Avatar
                      rounded
                      position="absolute"
                      bottom={30}
                      right={-5}
                      size={24}
                      source={{ uri: data.photoURL }}
                      
                    />) : (<Avatar
                      rounded
                      position="absolute"
                      bottom={30}
                      right={-5}
                      size={24}
                      source={require('../assets/icon/profile2.png')}
                    />)}  
                 
                    <Text style={styles.senderText}>{data.message}</Text>
                  </View>
                ) : (
                  <View key={id} style={styles.reciever}>
                  {data?.photoURL ?  (<Avatar
                    rounded
                    position="absolute"
                    bottom={30}
                    right={-5}
                    size={24}
                    source={{ uri: data.photoURL }}
                    
                  />) : (<Avatar
                    rounded
                    position="absolute"
                    bottom={0}
                    right={-5}
                    size={32}
                    source={require('../assets/icon/profile2.png')}
                  />)} 
                    <Text style={styles.recieverName}>{data.displayName}</Text>
                    <Text style={styles.recieverText}>{data.message}</Text>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                value={input}
                onChangeText={(text) => setInput(text)}
                placeholder="Enter message"
                onSubmitEditing={sendMessage}
                onFocus={scrollDownDelayed}
                style={styles.textInput}
              />
            <Avatar source={require('../assets/icon/send.png')} />

              <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
              <LongPressGestureHandler
                key={id}
                onHandlerStateChange={handleLongPress}
                minDurationMs={400}
              >
            <Avatar source={require('../assets/icon/send.png')} />
            </LongPressGestureHandler>
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reciever: {
    padding: 10,
    backgroundColor: `${theme.colors.primary}`,
    alignSelf: "flex-start",
    borderRadius: 20,
    marginLeft: 15,
    maxWidth: "80%",
    position: "relative",
    marginBottom: 10,
  },
  recieverName: {
    left: 10,
    paddingRight: 10,
    fontSize: 12,
    color: "white",
  },
  sender: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 10,
    maxWidth: "80%",
    position: "relative",
  },
  recieverText: {
    color: "white",
    fontWeight: "500",
  },
  senderText: {
    color: "black",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    padding: 15,
    width: "100%",
    alignItems: "center",
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    padding: 10,
    borderWidth: 1,
    color: "grey",
    borderRadius: 30,
  },
});
