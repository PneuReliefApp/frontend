import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Card,
  Text,
  TextInput,
  Button,
  Chip,
  Avatar,
  Divider,
} from "react-native-paper";
import { supabase } from "../../services/supabase_client";

type Gender = "male" | "female";
type Role = "patient" | "caregiver";

const safeTrim = (v: unknown) => (typeof v === "string" ? v.trim() : "");

const MALE_AVATAR =
  "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=740";
const FEMALE_AVATAR =
  "https://img.freepik.com/free-vector/fashionable-avatar-girl_24877-81624.jpg?w=740";

const resolveAvatarUrl = (g: Gender) =>
  g === "female" ? FEMALE_AVATAR : MALE_AVATAR;

export default function EditProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState<string>("");
  const [gender, setGender] = useState<Gender>("male");
  const [role, setRole] = useState<Role>("patient");
  const [email, setEmail] = useState<string>("");

  const avatarUrl = useMemo(() => resolveAvatarUrl(gender), [gender]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        const user = data?.user;

        if (!user) {
          setEmail("");
          setFullName("");
          setGender("male");
          setRole("patient");
          return;
        }

        setEmail(typeof user.email === "string" ? user.email : "");

        const rawMetaName =
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          user.user_metadata?.display_name;

        const metaName = safeTrim(rawMetaName);

        const emailPrefix =
          typeof user.email === "string" && user.email.includes("@")
            ? user.email.split("@")[0]
            : "";

        setFullName(metaName.length > 0 ? metaName : emailPrefix);

        const metaGenderRaw = user.user_metadata?.avatar_gender;
        const metaGender: Gender =
          metaGenderRaw === "female" ? "female" : "male";
        setGender(metaGender);

        const metaRoleRaw = user.user_metadata?.role;
        const metaRole: Role =
          metaRoleRaw === "caregiver" ? "caregiver" : "patient";
        setRole(metaRole);
      } catch (e: any) {
        console.error("Failed to load profile:", e?.message || e);
        Alert.alert("Error", "Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const saveProfile = async () => {
    const trimmed = safeTrim(fullName);
    if (!trimmed) {
      Alert.alert("Name required", "Please enter your name.");
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: trimmed,
          avatar_gender: gender,
          role: role,
        },
      });

      if (error) throw error;

      // refresh cached user
      await supabase.auth.getUser();

      Alert.alert("Saved", "Your profile has been updated.");
    } catch (e: any) {
      console.error("Failed to save profile:", e?.message || e);
      Alert.alert("Save failed", e?.message || "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Card style={styles.sectionCard} elevation={2}>
        <Card.Content style={styles.headerRow}>
          <Avatar.Image size={90} source={{ uri: avatarUrl }} />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text variant="titleLarge" style={{ fontWeight: "700" }}>
              Edit Profile
            </Text>
            <Text style={{ color: "gray", marginTop: 4 }}>
              {email ? `Signed in as ${email}` : "Not signed in"}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.sectionCard} elevation={2}>
        <Card.Title title="Basic Details" />
        <Card.Content>
          <TextInput
            label="Name"
            value={typeof fullName === "string" ? fullName : ""}
            onChangeText={(t) => setFullName(typeof t === "string" ? t : "")}
            mode="outlined"
            autoCapitalize="words"
            style={{ marginBottom: 12 }}
            disabled={loading || saving}
          />

          <Divider style={{ marginVertical: 12 }} />

          <Text style={styles.subHeader}>Gender</Text>
          <View style={styles.chipRow}>
            <Chip
              selected={gender === "male"}
              onPress={() => setGender("male")}
              disabled={loading || saving}
            >
              Male
            </Chip>
            <Chip
              selected={gender === "female"}
              onPress={() => setGender("female")}
              disabled={loading || saving}
            >
              Female
            </Chip>
          </View>

          <Text style={[styles.subHeader, { marginTop: 16 }]}>Role</Text>
          <View style={styles.chipRow}>
            <Chip
              selected={role === "patient"}
              onPress={() => setRole("patient")}
              disabled={loading || saving}
            >
              Patient
            </Chip>
            <Chip
              selected={role === "caregiver"}
              onPress={() => setRole("caregiver")}
              disabled={loading || saving}
            >
              Caregiver
            </Chip>
          </View>

          <Button
            mode="contained"
            onPress={saveProfile}
            loading={saving}
            disabled={saving || loading}
            style={{ marginTop: 18 }}
          >
            Save Changes
          </Button>

          <Text style={{ color: "gray", marginTop: 10 }}>
            Saved to Supabase Auth user metadata.
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  sectionCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  subHeader: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
});


