import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { login } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "../services/supabase_client";

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const signIn = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await login({ email, password });

      // Set the Supabase session with the tokens from backend
      // This will trigger the auth state listener in App.tsx
      await supabase.auth.setSession({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });

      setMessage("Logged in Successfully!");
      setIsError(false);

      // Navigation will be handled automatically by App.tsx
      // which listens to Supabase auth state changes
    } catch (error: any) {
      setMessage(error.message || "Invalid email or password");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setSocialLoading("google");
      setMessage("");

      // Use the app's custom scheme for redirect
      const redirectUrl = "pneurelief://auth/callback";

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        setMessage(`Google Sign-In Error: ${error.message}`);
        setIsError(true);
        setSocialLoading(null);
        return;
      }

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        );

        if (result.type === "success") {
          const url = result.url;
          const params = new URLSearchParams(url.split("#")[1] || url.split("?")[1]);
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          if (accessToken && refreshToken) {
            // Set the Supabase session - this triggers the auth listener in App.tsx
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) {
              setMessage(`Session Error: ${sessionError.message}`);
              setIsError(true);
            } else {
              setMessage("Logged in with Google Successfully!");
              setIsError(false);

              // Navigation will be handled automatically by App.tsx
              // which listens to Supabase auth state changes
            }
          }
        } else if (result.type === "cancel") {
          setMessage("Google Sign-In cancelled");
          setIsError(true);
        }
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      setIsError(true);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardView}
    >
      <LinearGradient
        colors={[COLORS.lightBlue, COLORS.softBlue, COLORS.white]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Card Container */}
          <View style={styles.card}>
            {/* Logo and Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.logoRow}>
                <Image
                  source={require("../../assets/pneurelief-logo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.brandText}>PneuRelief</Text>
              </View>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.subtitleText}>
                Please enter your details to sign in
              </Text>
            </View>

            {/* Error/Success Message */}
            {message ? (
              <View style={[styles.alertContainer, isError ? styles.alertError : styles.alertSuccess]}>
                <MaterialCommunityIcons
                  name={isError ? "alert-circle" : "check-circle"}
                  size={20}
                  color={isError ? COLORS.errorRed : "#10B981"}
                  style={styles.alertIcon}
                />
                <Text style={[styles.alertText, isError ? styles.alertTextError : styles.alertTextSuccess]}>
                  {message}
                </Text>
              </View>
            ) : null}

            {/* Social Login Buttons */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleSignIn}
                disabled={socialLoading !== null || loading}
              >
                {socialLoading === "google" ? (
                  <ActivityIndicator size="small" color="#DB4437" />
                ) : (
                  <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.socialButtonDisabled]}
                disabled={true}
              >
                <MaterialCommunityIcons name="apple" size={24} color="#000000" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.socialButtonDisabled]}
                disabled={true}
              >
                <MaterialCommunityIcons name="twitter" size={24} color="#1DA1F2" />
              </TouchableOpacity>
            </View>

            {/* OR Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Your Email Address</Text>
              <TextInput
                placeholder="Your Email Address"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor={COLORS.lightGray}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="••••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={styles.passwordInput}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me and Forgot Password */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {rememberMe && (
                    <MaterialCommunityIcons
                      name="check"
                      size={14}
                      color="#FFFFFF"
                    />
                  )}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.signInButton, loading && { opacity: 0.6 }]}
              onPress={signIn}
              disabled={loading || socialLoading !== null}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.signInButtonText}>Sign in</Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signUpLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 32,
    width: "90%",
    maxWidth: 440,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },

  // Header Section
  headerSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 120,
    height: 80,
  },
  brandText: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primaryBlue,
    letterSpacing: 0.5,
    marginLeft: -30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.darkText,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 14,
    color: COLORS.grayText,
  },

  // Social Buttons
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.backgroundGray,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  socialButtonDisabled: {
    opacity: 0.5,
  },

  // Divider
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.borderGray,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: COLORS.lightGray,
    fontWeight: "500",
  },

  // Input Fields
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.grayText,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.backgroundGray,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.darkText,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundGray,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: COLORS.darkText,
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },

  // Options Row
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.borderGray,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.accentPurple,
    borderColor: COLORS.accentPurple,
  },
  rememberMeText: {
    fontSize: 14,
    color: COLORS.grayText,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.accentPurple,
    fontWeight: "500",
  },

  // Sign In Button
  signInButton: {
    backgroundColor: COLORS.darkText,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },

  // Sign Up Link
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    fontSize: 14,
    color: COLORS.grayText,
  },
  signUpLink: {
    fontSize: 14,
    color: COLORS.accentPurple,
    fontWeight: "600",
  },

  // Alert/Message
  alertContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  alertError: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  alertSuccess: {
    backgroundColor: "#D1FAE5",
    borderWidth: 1,
    borderColor: "#6EE7B7",
  },
  alertIcon: {
    marginRight: 8,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  alertTextError: {
    color: "#991B1B",
  },
  alertTextSuccess: {
    color: "#065F46",
  },
});
