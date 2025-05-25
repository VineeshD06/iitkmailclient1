import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

interface Email {
  subject: string;
  from: string;
  date: string;
}

export default function InboxScreen() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const Email = await SecureStore.getItemAsync('email');
        if (!Email) {
          Alert.alert('Error', 'Missing email');
          return;
        }
        const email = Email.split('@')[0];
        const password = await SecureStore.getItemAsync('password');

        if (!email || !password) {
          Alert.alert('Error', 'Missing credentials');
          return;
        }

        const response = await axios.post('http://172.23.156.3:3000/api/inbox', {
          email,
          password,
        });

        const data = response.data as { emails?: Email[] };
        setEmails(data.emails || []);
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.message || 'Something went wrong';
        Alert.alert('Inbox Error', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading inbox...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={emails}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.subject}>{item.subject}</Text>
          <Text>From: {item.from}</Text>
          <Text>Date: {item.date}</Text>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text>No emails found.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  subject: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
