import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from "react-native";
import { supabase } from "../services/supabase_client";
import * as Linking from 'expo-linking';

export default function ForgotPasswordScreen({ navigation }:any) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: Linking.createURL('/reset-password'),
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Success", 
        "A password reset link has been sent to your email.",
        [{ text: "Back to Login", onPress: () => navigation.navigate("Auth") }]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* PneuRelief Logo Section - Matching AuthScreen */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.subtitle}>
        Enter your email address and we'll send you a link to reset your password.
      </Text>

      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#003366" style={{ marginVertical: 20 }} />
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleResetRequest}>
            <Text style={styles.buttonText}>Send Reset Link</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.linkText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      )}
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
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 100,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ddd", 
    marginBottom: 20, 
    padding: 15, 
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9'
  },
  buttonContainer: {
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#003366', // Matching AuthScreen primary blue
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
  backBtn: { 
    marginTop: 15, 
    alignItems: 'center' 
  },
  linkText: { 
    color: '#007AFF', 
    fontWeight: '600',
    fontSize: 14
  }
});