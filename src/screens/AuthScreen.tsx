import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { supabase } from "../services/supabase_client";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      setMessage(`Signup Error: ${error.message}`)
    } else if (data.user && data.session === null) {
      // when email confirmation is on
      setMessage("Success! Please check your email for a confirmation link.")
    } else {
      setMessage("Account created and logged in!")
    }
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setMessage(`Login Error: ${error.message}`)
    } else {
      setMessage("Logged in Succesfully!")
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase Authentication</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Sign Up" onPress={signUp} />
      <Button title="Sign In" onPress={signIn} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 20, textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
  message: { marginTop: 10, textAlign: "center" },
});

