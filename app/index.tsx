import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
    Alert,
    Animated,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

// Derived from the provided Tailwind config
const theme = {
  background: "#f4fafd",
  surface: "#f4fafd",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#eef5f7",
  surfaceContainer: "#e8eff1",
  surfaceContainerHigh: "#e2e9ec",
  primary: "#785900",
  primaryContainer: "#ffc107",
  onPrimaryContainer: "#6d5100",
  onPrimaryFixedVariant: "#5b4300",
  secondary: "#b02f00",
  tertiary: "#006972",
  tertiaryContainer: "#79d9e6",
  onTertiaryContainer: "#005f68",
  onTertiaryFixedVariant: "#004f56",
  onSurface: "#161d1f",
  onSurfaceVariant: "#4f4632",
  outlineVariant: "#d4c5ab",
};

export default function App() {
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Simulate progress bar animation on mount
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 65, // 65% complete
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [progressAnim]);

  const handleUploadPress = () => {
    Alert.alert("Upload", "File browser would open here.");
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOPtrJY4uLZTPCZYtr_CzuFPHCUmMTukPEowUfEP3MTMykJnVPE5-ZUlAseC-Khg7wmPbS0QatBnMYAFeBhhc4MikGQE4Xqkp1S1xkQDt7FYG68ghQlp0SgtxEuy276fIZnv81op5xTPu-qewJTNt1l0sTGvjQEFfgciEXa0OrvETgkpD5JprclEgnS0jOkA4wrz3R3Om87zv8a53ibdDTAyHJmoMuTJ6YwPGxdZ23QrFhS1Jm9dQ1vLnJZteXTVS23PHjRHwqKs4",
              }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.headerTitle}>Aral</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.streakBadge}>
            <Text style={{ fontSize: 14 }}>🔥</Text>
            <Text style={styles.streakText}>5</Text>
          </View>
          <Pressable style={styles.iconButton}>
            <MaterialIcons
              name="notifications"
              size={24}
              color={theme.onSurfaceVariant}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mascot & Speech Bubble */}
        <View style={styles.introSection}>
          <View style={styles.mascotWrapper}>
            <View style={styles.mascotContainer}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCutE36Jl0IW_Ld1hXHs7CNPDjuwpj_Du41qAg8v0fP67IJzCgWb3xxRmoAkbBRuyIRdRSuv1D1GQ4rRYL7JBuntmxwr_67ow8tiPykO0fF390Yw-4gBRrrvQoeKFWWOVmO3xZ4DDooUJZC1tdNi_alo63ezXPkszP14cxB815UKccwr1DdTzpSXLwbI2lhlIpd5SYO5QfGENDjOAGfWnF1C7PytYulqFIHraZEeQHGfHtXfWzTjkMxxoHhOKsYuOdQaWPRCnPhvAs",
                }}
                style={styles.avatar}
              />
            </View>
            <View style={styles.mascotBadge}>
              <MaterialIcons name="auto-stories" size={14} color="#fff" />
            </View>
          </View>

          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>
              "Ready to level up? Drop your notes or PDFs here, and I'll help
              you turn them into fun review cards!"
            </Text>
            <View style={styles.speechTail} />
          </View>
        </View>

        {/* Upload Drop Zone */}
        <View style={styles.uploadZoneContainer}>
          <Pressable style={styles.uploadZone} onPress={handleUploadPress}>
            <View style={styles.uploadIconCircle}>
              <MaterialIcons
                name="cloud-upload"
                size={40}
                color={theme.primary}
              />
            </View>
            <Text style={styles.uploadTitle}>Upload study materials</Text>
            <Text style={styles.uploadSubtitle}>
              Tap here to browse PDFs, images, or files
            </Text>
            <View style={styles.uploadButton}>
              <MaterialIcons
                name="folder-open"
                size={20}
                color={theme.onPrimaryContainer}
              />
              <Text style={styles.uploadButtonText}>Browse Files</Text>
            </View>
          </Pressable>
        </View>

        {/* Storage Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeaderRow}>
            <MaterialIcons
              name="analytics"
              size={24}
              color={theme.onTertiaryContainer}
            />
            <Text style={styles.statsTitle}>Storage</Text>
          </View>
          <View style={styles.progressBarBg}>
            <Animated.View
              style={[styles.progressBarFill, { width: progressWidth }]}
            />
          </View>
          <Text style={styles.statsSubtitle}>65% of 500MB used</Text>
        </View>

        {/* Supported Types Card */}
        <View style={styles.typesCard}>
          <Text style={styles.typesTitle}>Supported Types</Text>
          <View style={styles.typesWrapper}>
            <TypeChip icon="picture-as-pdf" color="#ef4444" label="PDF" />
            <TypeChip icon="image" color="#3b82f6" label="JPEG/PNG" />
            <TypeChip icon="description" color="#22c55e" label="TXT" />
          </View>
        </View>

        {/* Recent Uploads */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Recent uploads</Text>
            <Pressable>
              <Text style={styles.viewAllText}>View all</Text>
            </Pressable>
          </View>

          <RecentItem
            icon="picture-as-pdf"
            color="#dc2626"
            bgColor="#fef2f2"
            title="Kasaysayan_Module_1.pdf"
            subtitle="2.4 MB • Uploaded 2 hours ago"
          />
          <RecentItem
            icon="image"
            color="#2563eb"
            bgColor="#eff6ff"
            title="Bio_Lab_Notes_Camera.jpg"
            subtitle="4.1 MB • Uploaded Yesterday"
          />
          <RecentItem
            icon="article"
            color="#16a34a"
            bgColor="#f0fdf4"
            title="Algebra_Formulas_Text.txt"
            subtitle="12 KB • Uploaded 3 days ago"
          />
        </View>

        {/* Spacer for bottom nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Nav Bar */}
      <View style={styles.bottomNav}>
        <NavItem icon="home" label="Home" />
        <NavItem icon="upload-file" label="Upload" isActive />
        <NavItem icon="school" label="Lessons" />
        <NavItem icon="person" label="Profile" />
      </View>
    </SafeAreaView>
  );
}

// Subcomponents for cleaner organization
const TypeChip = ({ icon, color, label }) => (
  <View style={styles.chip}>
    <MaterialIcons name={icon} size={16} color={color} />
    <Text style={styles.chipText}>{label}</Text>
  </View>
);

const RecentItem = ({ icon, color, bgColor, title, subtitle }) => (
  <Pressable style={styles.recentItem}>
    <View style={styles.recentItemLeft}>
      <View style={[styles.recentIconBox, { backgroundColor: bgColor }]}>
        <MaterialIcons name={icon} size={28} color={color} />
      </View>
      <View style={styles.recentTextContainer}>
        <Text style={styles.recentItemTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.recentItemSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <Pressable style={styles.moreOptionsBtn}>
      <MaterialIcons
        name="more-vert"
        size={24}
        color={theme.onSurfaceVariant}
      />
    </Pressable>
  </Pressable>
);

const NavItem = ({ icon, label, isActive }) => (
  <Pressable style={[styles.navItem, isActive && styles.navItemActive]}>
    <MaterialIcons
      name={icon}
      size={24}
      color={isActive ? theme.onPrimaryContainer : theme.onSurfaceVariant}
    />
    <Text
      style={[
        styles.navItemText,
        isActive && { color: theme.onPrimaryContainer },
      ]}
    >
      {label}
    </Text>
  </Pressable>
);

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.surface,
    borderBottomWidth: 4,
    borderBottomColor: theme.surfaceContainerHigh,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.primary,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.primary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  streakText: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.primary,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  scrollContent: {
    padding: 20,
  },
  introSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 32,
  },
  mascotWrapper: {
    position: "relative",
  },
  mascotContainer: {
    width: 80,
    height: 80,
    backgroundColor: theme.primaryContainer,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: theme.primary,
    overflow: "hidden",
  },
  mascotBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: theme.secondary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  speechBubble: {
    flex: 1,
    backgroundColor: theme.surfaceContainerLowest,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.surfaceContainer,
    position: "relative",
  },
  speechText: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.onSurface,
  },
  speechTail: {
    position: "absolute",
    top: 24,
    left: -6,
    width: 12,
    height: 12,
    backgroundColor: theme.surfaceContainerLowest,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: theme.surfaceContainer,
    transform: [{ rotate: "45deg" }],
  },
  uploadZoneContainer: {
    backgroundColor: theme.surfaceContainerHigh, // Creates the solid shadow color
    borderRadius: 16,
    marginBottom: 20,
    paddingBottom: 4, // Acts as the 4px blocky depth (replacing borderBottomWidth)
  },
  uploadZone: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "rgba(120, 89, 0, 0.3)", // primary/30
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    // Because borderWidth is now perfectly even on all 4 sides,
    // the dashed border will render correctly on both iOS and Android.
  },
  uploadIconCircle: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(255, 193, 7, 0.2)", // primaryContainer/20
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  uploadTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.onSurface,
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 16,
    color: theme.onSurfaceVariant,
    marginBottom: 24,
  },
  uploadButton: {
    backgroundColor: theme.primaryContainer,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    borderBottomWidth: 4,
    borderBottomColor: "#b88600", // btn-depth-primary
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.onPrimaryContainer,
  },
  statsCard: {
    backgroundColor: theme.tertiaryContainer,
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    borderBottomWidth: 4,
    borderBottomColor: theme.onTertiaryFixedVariant,
  },
  statsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.onTertiaryContainer,
  },
  progressBarBg: {
    width: "100%",
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 6,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.tertiary,
    borderRadius: 6,
  },
  statsSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.onTertiaryContainer,
    opacity: 0.8,
  },
  typesCard: {
    backgroundColor: theme.surfaceContainerLow,
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.surfaceContainer,
    borderBottomWidth: 6,
    borderBottomColor: theme.surfaceContainerHigh,
  },
  typesTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.onSurface,
    marginBottom: 16,
  },
  typesWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: theme.surfaceContainerHigh,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.onSurface,
  },
  recentSection: {
    marginTop: 40,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.onSurface,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.primary,
  },
  recentItem: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.surfaceContainerLow,
    marginBottom: 12,
  },
  recentItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  recentIconBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  recentTextContainer: {
    flex: 1,
  },
  recentItemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.onSurface,
    marginBottom: 2,
  },
  recentItemSubtitle: {
    fontSize: 12,
    color: theme.onSurfaceVariant,
  },
  moreOptionsBtn: {
    padding: 8,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.surface,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingBottom: 24, // SafeArea adjustment
    borderTopWidth: 4,
    borderTopColor: theme.surfaceContainerHigh,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  navItemActive: {
    backgroundColor: theme.primaryContainer,
    borderRadius: 12,
    borderBottomWidth: 4,
    borderBottomColor: theme.onPrimaryFixedVariant,
    transform: [{ translateY: -4 }],
  },
  navItemText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    color: theme.onSurfaceVariant,
  },
});
