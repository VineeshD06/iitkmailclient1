import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { login } from '../utils/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(email, password);
      await SecureStore.setItemAsync('email', email);
      await SecureStore.setItemAsync('password', password);
      router.replace('/inbox');
    } catch (err) {
      let message = 'Unknown error';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const response = (err as any).response;
        message = response?.data?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      Alert.alert('Login Failed', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email</Text>
      <TextInput style={styles.input} onChangeText={setEmail} value={email} autoCapitalize="none" />
      <Text>Password</Text>
      <TextInput style={styles.input} onChangeText={setPassword} value={password} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
});
