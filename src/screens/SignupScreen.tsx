import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { signup } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../services/supabase_client";

type Role = "Patient" | "Caregiver";

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<Role>("Patient");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await signup({
        email,
        password,
        full_name: fullName,
        username,
        role,
        phone_number: phoneNumber,
        emergency_phone_number: role === "Patient" ? emergencyPhoneNumber : undefined,
      });

      // Set the Supabase session with the tokens from backend
      // This will trigger the auth state listener in App.tsx
      await supabase.auth.setSession({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });

      setMessage("Account created successfully!");
      setIsError(false);

      // Navigation will be handled automatically by App.tsx
      // which listens to Supabase auth state changes
    } catch (error: any) {
      setMessage(error.message || "Failed to create account");
      setIsError(true);
    } finally {
      setLoading(false);
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
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Text style={styles.titleText}>Create Account</Text>
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

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                placeholder="your.email@example.com"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor={COLORS.lightGray}
              />
            </View>

            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                placeholder="Enter your name"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
                placeholderTextColor={COLORS.lightGray}
              />
            </View>

            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                placeholder="Enter username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                autoCapitalize="none"
                placeholderTextColor={COLORS.lightGray}
              />
            </View>

            {/* Role Picker */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Role</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowRolePicker(true)}
              >
                <Text style={styles.pickerButtonText}>{role}</Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={24}
                  color={COLORS.grayText}
                />
              </TouchableOpacity>
            </View>

            {/* Phone Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                placeholder="+1 (555) 000-0000"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={styles.input}
                keyboardType="phone-pad"
                placeholderTextColor={COLORS.lightGray}
              />
            </View>

            {/* Emergency Phone Number Input - Only for Patients */}
            {role === "Patient" && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Emergency Phone Number</Text>
                <TextInput
                  placeholder="+1 (555) 000-0000"
                  value={emergencyPhoneNumber}
                  onChangeText={setEmergencyPhoneNumber}
                  style={styles.input}
                  keyboardType="phone-pad"
                  placeholderTextColor={COLORS.lightGray}
                />
              </View>
            )}

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
                  placeholderTextColor={COLORS.lightGray}
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

            {/* Continue Button */}
            <TouchableOpacity
              style={[styles.continueButton, loading && { opacity: 0.6 }]}
              onPress={handleContinue}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Text style={styles.continueButtonText}>Continue</Text>
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={20}
                    color={COLORS.white}
                  />
                </>
              )}
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
                <Text style={styles.signInLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Role Picker Modal */}
        <Modal
          visible={showRolePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowRolePicker(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowRolePicker(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Role</Text>
              <TouchableOpacity
                style={[
                  styles.roleOption,
                  role === "Patient" && styles.roleOptionSelected,
                ]}
                onPress={() => {
                  setRole("Patient");
                  setShowRolePicker(false);
                }}
              >
                <Text
                  style={[
                    styles.roleOptionText,
                    role === "Patient" && styles.roleOptionTextSelected,
                  ]}
                >
                  Patient
                </Text>
                {role === "Patient" && (
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color={COLORS.primaryBlue}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleOption,
                  role === "Caregiver" && styles.roleOptionSelected,
                ]}
                onPress={() => {
                  setRole("Caregiver");
                  setShowRolePicker(false);
                }}
              >
                <Text
                  style={[
                    styles.roleOptionText,
                    role === "Caregiver" && styles.roleOptionTextSelected,
                  ]}
                >
                  Caregiver
                </Text>
                {role === "Caregiver" && (
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color={COLORS.primaryBlue}
                  />
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
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
  titleText: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.darkText,
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

  // Role Picker
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.backgroundGray,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 12,
    padding: 16,
  },
  pickerButtonText: {
    fontSize: 16,
    color: COLORS.darkText,
  },

  // Continue Button
  continueButton: {
    backgroundColor: COLORS.darkText,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 20,
    flexDirection: "row",
    gap: 8,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },

  // Sign In Link
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signInText: {
    fontSize: 14,
    color: COLORS.grayText,
  },
  signInLink: {
    fontSize: 14,
    color: COLORS.accentPurple,
    fontWeight: "600",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    width: "80%",
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.darkText,
    marginBottom: 16,
    textAlign: "center",
  },
  roleOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    marginBottom: 12,
  },
  roleOptionSelected: {
    borderColor: COLORS.primaryBlue,
    backgroundColor: COLORS.lightBlue,
  },
  roleOptionText: {
    fontSize: 16,
    color: COLORS.darkText,
  },
  roleOptionTextSelected: {
    color: COLORS.primaryBlue,
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
