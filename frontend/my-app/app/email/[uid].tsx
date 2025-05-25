import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface EmailDetail {
  from: string;
  to: string;
  subject: string;
  date: string;
  body: string;
}

export default function EmailDetails() {
  const [email, setEmail] = useState<EmailDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { uid } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const emailStored = await SecureStore.getItemAsync('email');
        const passwordStored = await SecureStore.getItemAsync('password');
        if (!emailStored || !passwordStored || !uid) {
          router.replace('/login');
          return;
        }
        const Email = emailStored.split('@')[0];

        const res = await axios.post('http://172.23.156.3:3000/api/inbox/fetch-email', {
          email: Email,
          password: passwordStored,
          uid: Number(uid),
        });

        const data = res.data as { email?: EmailDetail };
        if (data.email) {
          setEmail(data.email);
        } else {
          Alert.alert('Error', 'Failed to load email');
        }
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Failed to fetch email');
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, [uid]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!email) {
    return (
      <View style={styles.container}>
        <Text>No email found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.subject}>{email.subject || '(No Subject)'}</Text>
      <Text style={styles.meta}>From: {email.from}</Text>
      <Text style={styles.meta}>To: {email.to}</Text>
      <Text style={styles.meta}>Date: {email.date}</Text>
      <View style={styles.bodyContainer}>
        <Text style={styles.body}>{email.body || '(No content)'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#fff' },
  subject: { fontWeight: 'bold', fontSize: 22, marginBottom: 12 },
  meta: { fontSize: 14, marginBottom: 6, color: '#555' },
  bodyContainer: { marginTop: 20 },
  body: { fontSize: 16, lineHeight: 24 },
});
