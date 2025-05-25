import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

const BASE_URL = 'http://172.23.156.3:3000/api';

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/login`, { email, password });
      const data = res.data as { message: string };
      Alert.alert('✅ Success', data.message);
      await SecureStore.setItemAsync('email', email);
      await SecureStore.setItemAsync('password', password);


      router.replace('/inbox');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Unknown error occurred';
      Alert.alert('❌ Login Failed', message);
      console.error(message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IITK Mail Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', paddingHorizontal: 20,
  },
  title: {
    fontSize: 22, marginBottom: 20, textAlign: 'center',
  },
  input: {
    height: 48, borderColor: '#ccc', borderWidth: 1, marginBottom: 15,
    paddingHorizontal: 10, borderRadius: 5,
  },
});
