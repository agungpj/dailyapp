import React, { useLayoutEffect, useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { Icon, Input, Button, Avatar } from "react-native-elements";
import { db } from "../firebase";
import CustomListItem from "../components/CustomListItem";


const ContactScreen = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [contact, setContact] = useState([]);


  useEffect(() => {
    const unsubscribe = db.collection("users").onSnapshot((snapshot) => {
      setContact(snapshot.docs.map((doc) => ({
        data: doc.data(),
      })))
      console.log(contact, "contactnya")
    });

    contact.map((data) => {
      console.log(data.data.name, "datanya")
    });


    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Contact",
      headerBackTitle: "Chats",
    });
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.avatarContainer}>
        <Avatar
          size={32}
          rounded
          title="AB"
          containerStyle={{ backgroundColor: 'purple' }}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.data.name}</Text>
        <Text style={styles.email}>{item.data.email}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contact}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    marginVertical: 8,
    marginHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 14,
    borderRadius: 8, 
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40, // Tentukan lebar container Avatar
  },
  textContainer: {
    marginLeft: 20,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: 'black',
    paddingBottom: 10,
  },
});