import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
// import ConfettiCannon from 'react-native-confetti-cannon'; // Uncomment if using confetti library

// Derived from the Tailwind config
const theme = {
  background: "#f4fafd",
  surface: "#f4fafd",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#eef5f7",
  surfaceContainer: "#e8eff1",
  surfaceContainerHigh: "#e2e9ec",
  surfaceContainerHighest: "#dde4e6",
  primary: "#785900",
  primaryContainer: "#ffc107",
  onPrimaryContainer: "#6d5100",
  primaryFixed: "#ffdf9e",
  onPrimaryFixedVariant: "#5b4300",
  secondary: "#b02f00",
  secondaryContainer: "#ff5722",
  onSecondary: "#ffffff",
  tertiary: "#006972",
  tertiaryContainer: "#79d9e6",
  onTertiaryContainer: "#005f68",
  onTertiaryFixedVariant: "#004f56",
  onSurface: "#161d1f",
  onSurfaceVariant: "#4f4632",
};

export default function App() {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const buttonSquish = useRef(new Animated.Value(6)).current;

  useEffect(() => {
    // Hero badge bouncing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [bounceAnim]);

  const handlePressIn = () => {
    Animated.spring(buttonSquish, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonSquish, {
      toValue: 6,
      useNativeDriver: false,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBA1wacQzE7Un4xwLEadXvL6NrgvQS9qeBRWjYidDUoj6rN7pf8Ir10IJHW17RiPvzs9Qls6OY84GpAyYxDfsr1pAd3YJ2swbM8t-H3uKfSIZDTYGhbLDxsNGv1qqZpkR2V-dqc1CtoFunhUdHemOHy2L80nYpud4VcMRuSw0c2uE6DqLVwsUsIE1oQfhr-W1asHv77wAYCqR5Y_B8ahGjGXu8OjSoAnkuso0Ji0SRbY_VNw_M6v3A0r_NJ-BtskvV3Mjx3oGeqehQ",
              }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.headerTitle}>Aral</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.streakBadge}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakText}>5</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.badgeWrapper}>
            <Animated.View
              style={[
                styles.explorerBadge,
                { transform: [{ translateY: bounceAnim }] },
              ]}
            >
              <MaterialIcons
                name="explore"
                size={60}
                color={theme.onPrimaryContainer}
              />
            </Animated.View>
            <View style={styles.newTag}>
              <Text style={styles.newTagText}>NEW!</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>You're an Explorer!</Text>
          <Text style={styles.heroSubtitle}>
            We've estimated your starting level as
          </Text>

          <View style={styles.levelPill}>
            <Text style={styles.levelPillText}>Beginner Explorer</Text>
          </View>
        </View>

        {/* Character Feedback */}
        <View style={styles.feedbackSection}>
          <View style={styles.mentorAvatar}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAM0tunbqGVSVxTvsSet3dwJoD9uWt0XzanV_qFZ1BNitoJTATK-teGjsfGfiIk5Z2PrFxRf8asSLrVOHfDuH3YcFK7LakVYphEQ6b-KlmryeAbjmBiSsR6Z0NqoCmGY_pHGGLlsEtsLbIDO6JeJAbpnVVhvwsP0lg4kGksiShXwSUepRZroVgIqiQM_aThgltlWISfoAOoDSUsuLihv6yHz8Vdv3qtfC6KHz43gbEgeO0_1Mo5rEbLQRLsIh4CGG8WjnxtzKN5-YI",
              }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>
              "Magaling! You have a great foundation in reading. Let's work on
              your speaking skills together to make you a pro!"
            </Text>
          </View>
        </View>

        {/* Score Breakdown - Bento Style */}
        <View style={styles.bentoGrid}>
          {/* Reading (Full Width) */}
          <View style={[styles.bentoCard, styles.fullWidthCard]}>
            <View style={styles.bentoHeaderRow}>
              <View style={styles.bentoTitleGroup}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: theme.tertiaryContainer },
                  ]}
                >
                  <MaterialIcons
                    name="menu-book"
                    size={20}
                    color={theme.onTertiaryContainer}
                  />
                </View>
                <Text style={styles.bentoTitle}>Reading</Text>
              </View>
              <Text style={[styles.bentoScore, { color: theme.tertiary }]}>
                85%
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { backgroundColor: theme.tertiary, width: "85%" },
                ]}
              />
            </View>
          </View>

          <View style={styles.bentoRow}>
            {/* Speaking (Half Width) */}
            <View style={[styles.bentoCard, styles.halfWidthCard]}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.primaryContainer, marginBottom: 8 },
                ]}
              >
                <MaterialIcons
                  name="mic"
                  size={20}
                  color={theme.onPrimaryContainer}
                />
              </View>
              <Text style={styles.bentoSmallTitle}>Speaking</Text>
              <Text style={[styles.bentoScore, { color: theme.primary }]}>
                62%
              </Text>
              <View style={[styles.progressBarBg, { marginTop: 12 }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    { backgroundColor: theme.primary, width: "62%" },
                  ]}
                />
              </View>
            </View>

            {/* Grammar (Half Width) */}
            <View style={[styles.bentoCard, styles.halfWidthCard]}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: theme.secondaryContainer,
                    marginBottom: 8,
                  },
                ]}
              >
                <MaterialIcons
                  name="edit-note"
                  size={20}
                  color={theme.onSecondary}
                />
              </View>
              <Text style={styles.bentoSmallTitle}>Grammar</Text>
              <Text style={[styles.bentoScore, { color: theme.secondary }]}>
                74%
              </Text>
              <View style={[styles.progressBarBg, { marginTop: 12 }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    { backgroundColor: theme.secondaryContainer, width: "74%" },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Call to Action Actions */}
        <View style={styles.actionSection}>
          <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <Animated.View
              style={[styles.ctaButtonWrapper, { paddingBottom: buttonSquish }]}
            >
              <View style={styles.ctaButtonInner}>
                <Text style={styles.ctaButtonText}>Start Learning</Text>
                <MaterialIcons
                  name="rocket-launch"
                  size={24}
                  color={theme.onPrimaryContainer}
                />
              </View>
            </Animated.View>
          </Pressable>

          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>
              Review Pretest Answers
            </Text>
          </Pressable>
        </View>

        {/* Spacer for bottom nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Nav Bar */}
      <View style={styles.bottomNav}>
        <NavItem icon="home" label="Home" />
        <NavItem icon="school" label="Lessons" />
        <NavItem icon="emoji-events" label="Awards" isActive />
        <NavItem icon="person" label="Profile" />
      </View>

      {/* Uncomment if using react-native-confetti-cannon */}
      {/* <ConfettiCannon count={50} origin={{x: -10, y: 0}} colors={['#785900', '#ffc107', '#006972', '#ff5722']} fallSpeed={2500} /> */}
    </SafeAreaView>
  );
}

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
    backgroundColor: theme.tertiaryContainer,
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
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  streakEmoji: {
    fontSize: 16,
  },
  streakText: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.secondary,
  },
  scrollContent: {
    padding: 20,
    alignItems: "center", // centers the max-w-md constraint naturally
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
    maxWidth: 400,
  },
  badgeWrapper: {
    position: "relative",
    marginBottom: 24,
  },
  explorerBadge: {
    width: 128,
    height: 128,
    backgroundColor: theme.primaryContainer,
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 6,
    borderBottomColor: "#b88a00",
  },
  newTag: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: theme.secondaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderBottomWidth: 2,
    borderBottomColor: theme.secondary,
  },
  newTagText: {
    color: theme.onSecondary,
    fontWeight: "bold",
    fontSize: 12,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.onSurface,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    color: theme.onSurfaceVariant,
  },
  levelPill: {
    marginTop: 16,
    backgroundColor: theme.tertiaryContainer,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 12,
    borderBottomWidth: 4,
    borderBottomColor: theme.onTertiaryFixedVariant,
  },
  levelPillText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.onTertiaryContainer,
  },
  feedbackSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: theme.surfaceContainerLowest,
    padding: 24,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.surfaceContainerHigh,
    marginBottom: 40,
    width: "100%",
    maxWidth: 400,
    gap: 16,
  },
  mentorAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.primaryFixed,
    overflow: "hidden",
  },
  speechBubble: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderWidth: 2,
    borderColor: theme.surfaceContainerHigh,
  },
  speechText: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.onSurface,
  },
  bentoGrid: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 40,
    gap: 16,
  },
  bentoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bentoCard: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.surfaceContainerHigh,
  },
  fullWidthCard: {
    width: "100%",
  },
  halfWidthCard: {
    width: "48%",
  },
  bentoHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bentoTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    padding: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  bentoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.onSurface,
  },
  bentoSmallTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: theme.onSurface,
  },
  bentoScore: {
    fontSize: 24,
    fontWeight: "bold",
  },
  progressBarBg: {
    width: "100%",
    height: 12,
    backgroundColor: theme.surfaceContainer,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  actionSection: {
    width: "100%",
    maxWidth: 400,
    gap: 16,
  },
  ctaButtonWrapper: {
    backgroundColor: "#b88a00", // Bottom depth color
    borderRadius: 16,
  },
  ctaButtonInner: {
    backgroundColor: theme.primaryContainer,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.onPrimaryContainer,
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.onSurfaceVariant,
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
    paddingBottom: 24, // SafeArea padding
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
