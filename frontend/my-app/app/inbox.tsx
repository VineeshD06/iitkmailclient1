import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { router } from 'expo-router';

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

  const handleComposePress = () => {
    router.push('/compose');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading inbox...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.composeButton} onPress={handleComposePress}>
        <Text style={styles.composeText}>+ Compose</Text>
      </TouchableOpacity>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  composeButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  composeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
