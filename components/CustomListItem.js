import React, { useEffect, useState } from "react";
import { ListItem, Avatar } from "react-native-elements";
import { db } from "../firebase";
import { Text, View } from 'react-native'
const CustomListItem = ({ id, chatName, photoURL, enterChat, check, onDelete }) => {
  const [chatMessages, setChatMessages] = useState([]);


  useEffect(() => {
    console.log(onDelete)
    const unsubscribe = db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setChatMessages(snapshot.docs.map((doc) => doc.data()))
      );
    console.log(photoURL)

    return unsubscribe;
  }, []);

  return (
    <ListItem key={id} bottomDivider onPress={() => enterChat(id, chatName, photoURL)}>
    <View style={{ position: 'absolute', top: 20, right: 39, zIndex: 1 }}>
  </View>

  {/* Foto profil */}
  <View>
    <Avatar
      rounded
      source={{
        uri: photoURL,
      }}
    />
  </View>
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800" }}>
          {chatName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">

          {chatMessages?.[0]?.displayName ? (
            <Text>{chatMessages[0].displayName}: {chatMessages[0].message}</Text>
          ) : (
            <></>
          )}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItem;
