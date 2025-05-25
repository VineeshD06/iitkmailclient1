import React, { useState } from 'react';
import { View, TextInput, Button, Alert, KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useRouter } from 'expo-router';

const BASE_URL = 'http://172.23.156.3:3000'; // Replace with your backend IP and port

export default function ComposeScreen() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const router = useRouter();

  const handleSend = async () => {
    if (!to.trim()) {
      Alert.alert('Validation Error', 'Recipient email is required.');
      return;
    }
    if (!subject.trim()) {
      Alert.alert('Validation Error', 'Subject is required.');
      return;
    }
    if (!body.trim()) {
      Alert.alert('Validation Error', 'Email body cannot be empty.');
      return;
    }

    const email = await SecureStore.getItemAsync('email');
    const password = await SecureStore.getItemAsync('password');

    if (!email || !password) {
      Alert.alert('Error', 'You must be logged in to send email.');
      router.push('/login');
      return;
    }

    setSending(true);

    try {
      const res = await axios.post(`${BASE_URL}/send`, {
        email,
        password,
        to,
        subject,
        text: body,
      });

      if (res.data.success) {
        Alert.alert('Success', 'Email sent successfully!');
        setTo('');
        setSubject('');
        setBody('');
        router.push('/inbox'); // Navigate back to inbox after sending
      } else {
        Alert.alert('Send Failed', res.data.message || 'Failed to send email.');
      }
    } catch (err) {
      console.error('Send email error:', err);
      Alert.alert('Error', 'Something went wrong while sending email.');
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Compose Mail</Text>

        <TextInput
          placeholder="To"
          value={to}
          onChangeText={setTo}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            borderBottomWidth: 1,
            borderColor: '#ccc',
            marginBottom: 16,
            fontSize: 16,
            paddingVertical: 8,
          }}
          editable={!sending}
        />

        <TextInput
          placeholder="Subject"
          value={subject}
          onChangeText={setSubject}
          style={{
            borderBottomWidth: 1,
            borderColor: '#ccc',
            marginBottom: 16,
            fontSize: 16,
            paddingVertical: 8,
          }}
          editable={!sending}
        />

        <TextInput
          placeholder="Body"
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={8}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 4,
            padding: 12,
            fontSize: 16,
            textAlignVertical: 'top',
            marginBottom: 24,
            height: 150,
          }}
          editable={!sending}
        />

        <Button title={sending ? 'Sending...' : 'Send'} onPress={handleSend} disabled={sending} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
