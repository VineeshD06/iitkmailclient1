import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { fetchInbox } from '../utils/api';

type Email = {
  subject?: string;
  from?: { text?: string };
  // Add other fields as needed
};

export default function Inbox() {
  const [emails, setEmails] = useState<Email[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadInbox = async () => {
      try {
        const email = await SecureStore.getItemAsync('email');
        const password = await SecureStore.getItemAsync('password');
        if (email && password) {
          const data = await fetchInbox(email, password);
          if (typeof data === 'object' && data !== null && 'emails' in data && Array.isArray((data as any).emails)) {
            setEmails((data as { emails: Email[] }).emails || []);
          } else {
            setEmails([]);
          }
        }
      } catch (err) {
        let message = 'Unknown error';
        if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
          message = (err.response.data as { message?: string }).message || message;
        } else if (err instanceof Error) {
          message = err.message;
        }
        Alert.alert('Inbox Error', message);
      }
    };

    loadInbox();
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Compose" onPress={() => router.push('/compose')} />
      <FlatList
        data={emails}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.emailItem}>
            <Text style={styles.subject}>{item.subject || '(No Subject)'}</Text>
            <Text>{item.from?.text || ''}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  emailItem: { marginBottom: 15, padding: 10, borderWidth: 1, borderRadius: 5 },
  subject: { fontWeight: 'bold' },
});
