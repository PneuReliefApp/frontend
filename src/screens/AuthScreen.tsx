import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { supabase } from "../services/supabase_client";
import * as Linking from 'expo-linking';

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(`Signup Error: ${error.message}`);
    else if (data.user && data.session === null) setMessage("Check your email for confirmation!");
    setLoading(false);
  };

  const signIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(`Login Error: ${error.message}`);
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("Please enter your email first.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: Linking.createURL('/reset-password'),
    });
    if (error) setMessage(error.message);
    else setMessage("Reset link sent to your email!");
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: Linking.createURL('/') }
    });
    if (error) setMessage(error.message);
  };

  return (
    <View style={styles.container}>
      {/* PneuRelief Logo Section */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#003366" style={{ marginVertical: 20 }} />
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={signIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={signUp}>
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
          
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={signInWithGoogle}>
            <Text style={styles.googleButtonText}>Sign In with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotBtn}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      )}

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    padding: 30, 
    backgroundColor: '#fff' 
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 250,
    height: 100,
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ddd", 
    marginBottom: 15, 
    padding: 15, 
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9'
  },
  buttonContainer: {
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#003366', // Matching the dark blue in the logo
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#003366',
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: '#003366',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  googleButtonText: {
    color: '#444',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#aaa',
    fontSize: 12,
  },
  message: { 
    marginTop: 20, 
    textAlign: "center", 
    color: '#d9534f',
    fontSize: 14 
  },
  forgotBtn: { 
    marginTop: 15, 
    alignItems: 'center' 
  },
  linkText: { 
    color: '#007AFF', 
    fontWeight: '600',
    fontSize: 14
  }
});

