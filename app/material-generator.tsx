import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
    Alert,
    Animated,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

// Derived from your provided Tailwind config
const theme = {
  background: "#f4fafd",
  surface: "#f4fafd",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#eef5f7",
  surfaceContainerHigh: "#e2e9ec",
  surfaceContainerHighest: "#dde4e6",
  primary: "#785900",
  primaryContainer: "#ffc107",
  onPrimaryContainer: "#6d5100",
  primaryFixed: "#ffdf9e",
  onPrimaryFixedVariant: "#5b4300",
  secondary: "#b02f00",
  secondaryFixed: "#ffdbd1",
  secondaryFixedDim: "#ffb5a0",
  onSecondaryContainer: "#541100",
  tertiary: "#006972",
  tertiaryContainer: "#79d9e6",
  onTertiaryContainer: "#005f68",
  tertiaryFixed: "#92f1fe",
  outline: "#827660",
  outlineVariant: "#d4c5ab",
  onSurface: "#161d1f",
  onSurfaceVariant: "#4f4632",
  error: "#ba1a1a",
};

export default function App() {
  const [inputText, setInputText] = useState("");
  const [selectedType, setSelectedType] = useState("lessons");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complexity, setComplexity] = useState("Beginner");
  const [illustrationsEnabled, setIllustrationsEnabled] = useState(true);

  const buttonSquish = useRef(new Animated.Value(4)).current; // For the 3D button effect

  const handlePressIn = () => {
    Animated.spring(buttonSquish, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonSquish, {
      toValue: 4,
      useNativeDriver: false,
    }).start();
  };

  const handleGenerate = () => {
    if (!inputText.trim()) {
      Alert.alert(
        "Missing Content",
        "Please enter some notes or a topic first.",
      );
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 20;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            Alert.alert(
              "Success!",
              "Material Generated Successfully! Redirecting...",
            );
            setIsGenerating(false);
            setProgress(0);
            setInputText("");
          }, 500);
          return 100;
        }
        return next;
      });
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.headerTitle}>Aral</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.streakBadge}>
            <Text style={{ fontSize: 16 }}>🔥</Text>
            <Text style={styles.streakText}>5</Text>
          </View>
          <Pressable style={styles.notificationBtn}>
            <MaterialIcons
              name="notifications"
              size={24}
              color={theme.primary}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Create Learning Magic</Text>
            <Text style={styles.heroSubtitle}>
              Paste your notes or a topic, and I'll build a personalized lesson
              just for you.
            </Text>
          </View>
          <MaterialIcons
            name="auto-awesome"
            size={48}
            color={theme.onPrimaryContainer}
          />
        </View>

        {/* Source Content Input */}
        <View style={styles.inputCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="edit-note" size={20} color={theme.primary} />
            <Text style={styles.sectionTitle}>SOURCE CONTENT</Text>
          </View>
          <TextInput
            style={[
              styles.textInput,
              inputText.length > 4800 && { borderColor: theme.secondary },
            ]}
            multiline
            placeholder="Type a topic (e.g. 'Photosynthesis') or paste your study material here..."
            placeholderTextColor={theme.outline}
            value={inputText}
            onChangeText={setInputText}
            maxLength={5000}
          />
          <View style={styles.inputFooter}>
            <Text
              style={[
                styles.charCount,
                inputText.length > 4800 && { color: theme.secondary },
              ]}
            >
              {inputText.length} / 5000 characters
            </Text>
            <Pressable style={styles.attachBtn}>
              <MaterialIcons
                name="attach-file"
                size={16}
                color={theme.tertiary}
              />
              <Text style={styles.attachText}>Upload PDF</Text>
            </Pressable>
          </View>
        </View>

        {/* Output Type Selection */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>OUTPUT TYPE</Text>
          <View style={styles.typeContainer}>
            <TypeButton
              title="Interactive Lesson"
              subtitle="Narrative + visual slides"
              icon="school"
              type="lessons"
              color={theme.primary}
              bgColor={theme.primaryFixed}
              isSelected={selectedType === "lessons"}
              onPress={() => setSelectedType("lessons")}
            />
            <TypeButton
              title="Quiz Challenge"
              subtitle="MCQs & True/False"
              icon="quiz"
              type="quizzes"
              color={theme.secondary}
              bgColor={theme.secondaryFixedDim}
              isSelected={selectedType === "quizzes"}
              onPress={() => setSelectedType("quizzes")}
            />
            <TypeButton
              title="Flashcards"
              subtitle="Spaced repetition deck"
              icon="style"
              type="flashcards"
              color={theme.tertiary}
              bgColor={theme.tertiaryFixed}
              isSelected={selectedType === "flashcards"}
              onPress={() => setSelectedType("flashcards")}
            />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>Complexity Level</Text>
            <View style={styles.segmentedControl}>
              <Pressable
                style={[
                  styles.segmentBtn,
                  complexity === "Beginner" && styles.segmentActive,
                ]}
                onPress={() => setComplexity("Beginner")}
              >
                <Text
                  style={[
                    styles.segmentText,
                    complexity === "Beginner" && styles.segmentTextActive,
                  ]}
                >
                  Beginner
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.segmentBtn,
                  complexity === "Expert" && styles.segmentActive,
                ]}
                onPress={() => setComplexity("Expert")}
              >
                <Text
                  style={[
                    styles.segmentText,
                    complexity === "Expert" && styles.segmentTextActive,
                  ]}
                >
                  Expert
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.preferenceRowSpacer}>
            <Text style={styles.preferenceLabel}>Add Illustrations</Text>
            {/* Simple custom toggle */}
            <Pressable
              style={[
                styles.toggleContainer,
                illustrationsEnabled
                  ? { backgroundColor: theme.tertiary }
                  : { backgroundColor: theme.outlineVariant },
              ]}
              onPress={() => setIllustrationsEnabled(!illustrationsEnabled)}
            >
              <View
                style={[
                  styles.toggleCircle,
                  illustrationsEnabled
                    ? { alignSelf: "flex-end" }
                    : { alignSelf: "flex-start" },
                ]}
              />
            </Pressable>
          </View>
        </View>

        {/* Generate Button */}
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleGenerate}
          disabled={isGenerating}
        >
          <Animated.View
            style={[
              styles.generateBtn,
              { paddingBottom: buttonSquish, opacity: isGenerating ? 0.6 : 1 },
            ]}
          >
            <View style={styles.generateBtnInner}>
              <MaterialIcons size={24} color={theme.onPrimaryContainer} />
              <Text style={styles.generateBtnText}>Generate</Text>
            </View>
          </Animated.View>
        </Pressable>

        {/* Loading State Area */}
        {isGenerating && (
          <View style={styles.loadingArea}>
            <View style={styles.loadingIconWrapper}>
              <MaterialIcons
                name="auto-fix-high"
                size={32}
                color={theme.primary}
              />
            </View>
            <Text style={styles.loadingTitle}>Thinking...</Text>
            <Text style={styles.loadingSubtitle}>
              Organizing concepts and creating your material.
            </Text>
            <View style={styles.progressBarBg}>
              <View
                style={[styles.progressBarFill, { width: `${progress}%` }]}
              />
            </View>
          </View>
        )}

        {/* Recent Creations */}
        <View style={styles.recentSection}>
          <Text style={styles.recentHeader}>Recent Creations</Text>
          <RecentCard
            icon="quiz"
            color={theme.secondary}
            bgColor={theme.secondaryFixed}
            type="QUIZ"
            title="Ancient Civilizations"
            desc="15 Questions • 2h ago"
          />
          <RecentCard
            icon="style"
            color={theme.tertiary}
            bgColor={theme.tertiaryFixed}
            type="CARDS"
            title="Organic Chemistry II"
            desc="42 Cards • Yesterday"
          />
          <RecentCard
            icon="school"
            color={theme.primary}
            bgColor={theme.primaryFixed}
            type="LESSON"
            title="Filipino Grammar"
            desc="8 Slides • 3d ago"
          />
        </View>

        {/* Spacer for bottom nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Nav Bar */}
      <View style={styles.bottomNav}>
        <NavItem icon="home" label="Home" />
        <NavItem icon="school" label="Lessons" isActive />
        <NavItem icon="emoji-events" label="Awards" />
        <NavItem icon="person" label="Profile" />
      </View>
    </SafeAreaView>
  );
}

// Subcomponents for cleaner code
const TypeButton = ({
  title,
  subtitle,
  icon,
  color,
  bgColor,
  isSelected,
  onPress,
}) => (
  <Pressable
    style={[
      styles.typeBtn,
      isSelected && { borderColor: color, backgroundColor: bgColor },
    ]}
    onPress={onPress}
  >
    <View style={[styles.typeIconWrapper, { backgroundColor: bgColor }]}>
      <MaterialIcons name={icon} size={24} color={color} />
    </View>
    <View style={styles.typeTextWrapper}>
      <Text
        style={[
          styles.typeTitle,
          isSelected && { color: theme.onSecondaryContainer },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.typeSubtitle,
          isSelected && { color: theme.onSecondaryContainer },
        ]}
      >
        {subtitle}
      </Text>
    </View>
  </Pressable>
);

const RecentCard = ({ icon, color, bgColor, type, title, desc }) => (
  <Pressable style={styles.recentCard}>
    <View style={styles.recentCardHeader}>
      <MaterialIcons name={icon} size={32} color={color} />
      <View style={[styles.tag, { backgroundColor: bgColor }]}>
        <Text style={[styles.tagText, { color: theme.onSurface }]}>{type}</Text>
      </View>
    </View>
    <Text style={styles.recentCardTitle}>{title}</Text>
    <Text style={styles.recentCardDesc}>{desc}</Text>
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

// Styles
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
    backgroundColor: theme.primaryContainer,
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
    borderWidth: 1,
    borderColor: theme.outlineVariant,
    gap: 4,
  },
  streakText: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.onSurface,
  },
  notificationBtn: {
    padding: 8,
    borderRadius: 20,
  },
  scrollContent: {
    padding: 20,
  },
  heroSection: {
    backgroundColor: theme.primaryContainer,
    padding: 20,
    borderRadius: 12,
    borderBottomWidth: 4,
    borderBottomColor: theme.onPrimaryFixedVariant,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  heroTextContainer: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.onPrimaryContainer,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: theme.onPrimaryContainer,
    opacity: 0.9,
    lineHeight: 24,
  },
  inputCard: {
    backgroundColor: theme.surfaceContainerLowest,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.surfaceContainerHigh,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.onSurfaceVariant,
    letterSpacing: 1,
    marginBottom: 8,
  },
  textInput: {
    height: 200,
    backgroundColor: theme.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.surfaceContainerHigh,
    padding: 16,
    fontSize: 16,
    color: theme.onSurface,
    textAlignVertical: "top",
  },
  inputFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  charCount: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.outline,
  },
  attachBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  attachText: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.tertiary,
  },
  card: {
    backgroundColor: theme.surfaceContainerLow,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.surfaceContainerHigh,
    marginBottom: 20,
  },
  typeContainer: {
    gap: 12,
  },
  typeBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: theme.surface,
    gap: 12,
  },
  typeIconWrapper: {
    padding: 8,
    borderRadius: 8,
  },
  typeTextWrapper: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.onSurface,
  },
  typeSubtitle: {
    fontSize: 12,
    color: theme.outline,
    marginTop: 2,
  },
  preferenceRow: {
    marginBottom: 16,
  },
  preferenceRowSpacer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  preferenceLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.outline,
    marginBottom: 8,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: theme.surface,
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.outlineVariant,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: "center",
    borderRadius: 6,
  },
  segmentActive: {
    backgroundColor: theme.tertiaryContainer,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.onSurface,
  },
  segmentTextActive: {
    color: theme.onTertiaryContainer,
  },
  toggleContainer: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: "center",
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  generateBtn: {
    backgroundColor: theme.onPrimaryFixedVariant, // Used as the shadow/bottom border
    borderRadius: 12,
    marginBottom: 24,
  },
  generateBtnInner: {
    backgroundColor: theme.primaryContainer,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  generateBtnText: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.onPrimaryContainer,
  },
  loadingArea: {
    backgroundColor: theme.surfaceContainerHigh,
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: theme.outlineVariant,
    alignItems: "center",
    marginBottom: 24,
  },
  loadingIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.primaryFixed,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.onSurfaceVariant,
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: theme.outline,
    textAlign: "center",
    marginBottom: 24,
  },
  progressBarBg: {
    width: "100%",
    height: 12,
    backgroundColor: theme.surface,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.primary,
  },
  recentSection: {
    marginBottom: 24,
  },
  recentHeader: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.onSurface,
    marginBottom: 16,
  },
  recentCard: {
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.surfaceContainerHigh,
    marginBottom: 16,
  },
  recentCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  recentCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.onSurface,
    marginBottom: 4,
  },
  recentCardDesc: {
    fontSize: 14,
    color: theme.outline,
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
    paddingBottom: 24, // Extra padding for safe area
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
