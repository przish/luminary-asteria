import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Platform 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Extracted from your Tailwind Config
const theme = {
  background: '#f4fafd',
  surface: '#f4fafd',
  onBackground: '#161d1f',
  primary: '#785900',
  primaryContainer: '#ffc107',
  onPrimaryContainer: '#6d5100',
  onPrimaryFixedVariant: '#5b4300',
  inversePrimary: '#fabd00',
  secondary: '#b02f00',
  secondaryFixed: '#ffdbd1',
  onSecondaryFixed: '#3b0900',
  tertiary: '#006972',
  tertiaryContainer: '#79d9e6',
  onTertiaryContainer: '#005f68',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  surfaceContainerLow: '#eef5f7',
  surfaceContainerHigh: '#e2e9ec',
  surfaceContainerHighest: '#dde4e6',
  onSurface: '#161d1f',
  onSurfaceVariant: '#4f4632',
  outlineVariant: '#d4c5ab',
  white: '#ffffff',
};

export default function ProfileSettings() {
  const [progress, setProgress] = useState(0);

  // Animate progress bar on load
  useEffect(() => {
    const timer = setTimeout(() => setProgress(85), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* TopAppBar */}
      <View style={styles.topNav}>
        <View style={styles.navLeft}>
          <View style={styles.headerAvatarContainer}>
            <Image 
              source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Juan&backgroundColor=ffdf9e' }} 
              style={styles.headerAvatar} 
            />
          </View>
          <Text style={styles.navTitle}>Aral</Text>
        </View>
        <TouchableOpacity style={styles.streakBadge} activeOpacity={0.8}>
          <Text style={styles.streakText}>🔥 5</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.mainScroll} showsVerticalScrollIndicator={false}>
        
        {/* Profile Header Section */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.mainAvatarContainer}>
              <Image 
                source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Juan&style=circle' }} 
                style={styles.mainAvatar} 
              />
            </View>
            <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
              <MaterialIcons name="edit" size={18} color={theme.white} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Juan Dela Cruz</Text>
            <Text style={styles.profileLevel}>LEVEL 12 • TAGALOG EXPLORER</Text>
          </View>

          {/* Quick Stats Row */}
          <View style={styles.statsRow}>
            <View style={[styles.statBox, styles.statBoxPrimary]}>
              <Text style={styles.statValuePrimary}>1,240</Text>
              <Text style={styles.statLabelPrimary}>Total XP</Text>
            </View>
            <View style={[styles.statBox, styles.statBoxTertiary]}>
              <Text style={styles.statValueTertiary}>15</Text>
              <Text style={styles.statLabelTertiary}>Badges</Text>
            </View>
          </View>
        </View>

        {/* Progress Tracker */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>LEARNING MILESTONE</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Daily Goal</Text>
              <Text style={styles.progressText}>850 / 1000 XP</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>
        </View>

        {/* Settings List */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>SETTINGS</Text>
          <View style={styles.settingsList}>
            <SettingItem 
              icon="track-changes" 
              title="Learning Goals" 
              subtitle="Daily targets & intense mode"
              iconBg={theme.primaryContainer}
              iconColor={theme.onPrimaryContainer}
            />
            <SettingItem 
              icon="notifications-active" 
              title="Notification Preferences" 
              subtitle="Reminders & achievement alerts"
              iconBg={theme.tertiaryContainer}
              iconColor={theme.onTertiaryContainer}
            />
            <SettingItem 
              icon="translate" 
              title="Language Settings" 
              subtitle="Tagalog, English, and dialects"
              iconBg={theme.secondaryFixed}
              iconColor={theme.onSecondaryFixed}
            />
            <SettingItem 
              icon="link" 
              title="Linked Accounts" 
              subtitle="Social media and cloud backup"
              iconBg={theme.surfaceContainerHighest}
              iconColor={theme.onSurface}
            />
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
            <MaterialIcons name="logout" size={24} color={theme.onErrorContainer} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
        
        {/* Spacer for bottom nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Nav Bar */}
      <View style={styles.bottomNav}>
        <BottomTab icon="home" label="Home" />
        <BottomTab icon="school" label="Lessons" />
        <BottomTab icon="emoji-events" label="Awards" />
        <BottomTab icon="person" label="Profile" isActive />
      </View>
    </SafeAreaView>
  );
}

// Helper Components
const SettingItem = ({ icon, title, subtitle, iconBg, iconColor }: any) => (
  <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
    <View style={styles.settingLeft}>
      <View style={[styles.settingIconBox, { backgroundColor: iconBg }]}>
        <MaterialIcons name={icon} size={24} color={iconColor} />
      </View>
      <View>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <MaterialIcons name="chevron-right" size={24} color={theme.onSurfaceVariant} />
  </TouchableOpacity>
);

const BottomTab = ({ icon, label, isActive = false }: { icon: any, label: string, isActive?: boolean }) => (
  <TouchableOpacity style={[styles.bottomTab, isActive && styles.bottomTabActive]} activeOpacity={isActive ? 1 : 0.7}>
    <MaterialIcons 
      name={icon} 
      size={24} 
      color={isActive ? theme.onPrimaryContainer : theme.onSurfaceVariant} 
    />
    <Text style={[styles.bottomTabText, isActive ? { color: theme.onPrimaryContainer } : { color: theme.onSurfaceVariant }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.surface,
    borderBottomWidth: 4,
    borderBottomColor: theme.surfaceContainerHigh,
    zIndex: 10,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.primary,
    overflow: 'hidden',
  },
  headerAvatar: {
    width: '100%',
    height: '100%',
  },
  navTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.primary,
  },
  streakBadge: {
    backgroundColor: theme.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.onSurface,
  },
  mainScroll: {
    padding: 20,
    gap: 16,
  },
  profileCard: {
    backgroundColor: theme.white,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.outlineVariant,
    borderBottomWidth: 4,
    borderBottomColor: theme.outlineVariant,
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  mainAvatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: theme.primaryContainer,
    padding: 4,
    backgroundColor: theme.white,
  },
  mainAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.secondary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.white,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41 },
      android: { elevation: 2 },
    }),
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.onSurface,
    marginBottom: 4,
  },
  profileLevel: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
  },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderBottomWidth: 4,
  },
  statBoxPrimary: {
    backgroundColor: theme.primaryContainer,
    borderBottomColor: theme.primary,
  },
  statBoxTertiary: {
    backgroundColor: theme.tertiaryContainer,
    borderBottomColor: theme.tertiary,
  },
  statValuePrimary: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.onPrimaryContainer,
  },
  statLabelPrimary: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.onPrimaryContainer,
  },
  statValueTertiary: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.onTertiaryContainer,
  },
  statLabelTertiary: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.onTertiaryContainer,
  },
  sectionContainer: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.onSurfaceVariant,
    marginBottom: 12,
    paddingHorizontal: 8,
    letterSpacing: 0.5,
  },
  progressCard: {
    backgroundColor: theme.white,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.outlineVariant,
    borderBottomWidth: 4,
    borderBottomColor: theme.surfaceContainerHigh,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.onBackground,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.primary,
  },
  progressTrack: {
    height: 16,
    backgroundColor: theme.surfaceContainerHigh,
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.primaryContainer, // Replaced gradient with solid brand color
    borderRadius: 8,
  },
  settingsList: {
    gap: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.outlineVariant,
    borderBottomWidth: 4,
    borderBottomColor: theme.surfaceContainerHigh,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.onBackground,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.onSurfaceVariant,
  },
  logoutContainer: {
    paddingTop: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.errorContainer,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    borderBottomWidth: 4,
    borderBottomColor: theme.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.onErrorContainer,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.surface,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 12,
    borderTopWidth: 4,
    borderTopColor: theme.surfaceContainerHigh,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  bottomTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bottomTabActive: {
    backgroundColor: theme.primaryContainer,
    borderBottomWidth: 4,
    borderBottomColor: theme.onPrimaryFixedVariant,
    transform: [{ translateY: -4 }],
  },
  bottomTabText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  }
});