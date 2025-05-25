import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { sendMail } from '../utils/api';

export default function Compose() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSend = async () => {
    try {
      const email = await SecureStore.getItemAsync('email');
      const password = await SecureStore.getItemAsync('password');
      if (email && password) {
        await sendMail(email, password, to, subject, body);
        Alert.alert('Success', 'Mail sent successfully');
      }
    } catch (err) {
      let message = 'Unknown error';
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        // @ts-ignore
        message = err.response.data.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      Alert.alert('Send Failed', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>To</Text>
      <TextInput style={styles.input} value={to} onChangeText={setTo} />
      <Text>Subject</Text>
      <TextInput style={styles.input} value={subject} onChangeText={setSubject} />
      <Text>Body</Text>
      <TextInput style={[styles.input, { height: 100 }]} value={body} onChangeText={setBody} multiline />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
});
