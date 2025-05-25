import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function ComposeScreen() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSend = async () => {
    const email = await SecureStore.getItemAsync('email');
    const password = await SecureStore.getItemAsync('password');

    if (!email || !password) {
      Alert.alert('Not authenticated');
      return;
    }

    try {
      const response = await axios.post('http://172.23.156.3:3000/api/send', {
        email: email,
        to,
        subject,
        text: body,
        password,
      });

      if (response.status === 200) {
        Alert.alert('Mail sent successfully!');
        setTo('');
        setSubject('');
        setBody('');
      } else {
        Alert.alert('Failed to send email');
      }
    } catch (err) {
      Alert.alert('Error sending mail', String(err));
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="To"
        value={to}
        onChangeText={setTo}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
        style={styles.input}
      />
      <TextInput
        placeholder="Message"
        value={body}
        onChangeText={setBody}
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={6}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
});
