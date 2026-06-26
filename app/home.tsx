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
  tertiary: '#006972',
  tertiaryContainer: '#79d9e6',
  onTertiaryContainer: '#005f68',
  secondaryContainer: '#ff5722',
  onSecondaryContainer: '#541100',
  onSecondary: '#ffffff',
  outlineVariant: '#d4c5ab',
  surfaceContainerHigh: '#e2e9ec',
  surfaceContainerHighest: '#dde4e6',
  surfaceContainerLow: '#eef5f7',
  onSurface: '#161d1f',
  onSurfaceVariant: '#4f4632',
  white: '#ffffff',
  buttonShadow: '#b78b00'
};

export default function Home() {
  const [progress, setProgress] = useState(0);

  // Simple micro-interaction for progress bar on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(65);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* TopAppBar */}
      <View style={styles.topNav}>
        <View style={styles.navLeft}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Juan&backgroundColor=ffdf9e' }} 
              style={styles.avatar} 
            />
          </View>
          <Text style={styles.navTitle}>Aral</Text>
        </View>
        <TouchableOpacity style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 5</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Canvas */}
      <ScrollView contentContainerStyle={styles.mainScroll} showsVerticalScrollIndicator={false}>
        
        {/* Welcome Section */}
        <View style={styles.headerSection}>
          <Text style={styles.welcomeText}>
            Mabuhay, <Text style={styles.textPrimary}>Juan!</Text>
          </Text>
          <Text style={styles.subtitleText}>Ready for your daily learning session?</Text>
        </View>

        {/* Current Lesson Card */}
        <View style={styles.lessonCard}>
          <View style={styles.lessonBadge}>
            <Text style={styles.lessonBadgeText}>CURRENT LESSON</Text>
          </View>
          <Text style={styles.lessonTitle}>Basic Tagalog Grammar</Text>
          <Text style={styles.lessonDesc}>Master the focus system of Tagalog verbs and simple sentence structures.</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressLabel}>{progress}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>Continue Learning</Text>
            <MaterialIcons name="play-circle-filled" size={24} color={theme.onPrimaryFixedVariant} />
          </TouchableOpacity>
        </View>

        {/* Stats Sidebar */}
        <View style={styles.statsContainer}>
          {/* Streak Card */}
          <View style={styles.streakCard}>
            <View>
              <Text style={styles.streakCardLabel}>Daily Streak</Text>
              <Text style={styles.streakCardValue}>5 Days</Text>
            </View>
            <Text style={styles.streakEmoji}>🔥</Text>
          </View>

          {/* Upcoming Topics Card */}
          <View style={styles.upcomingCard}>
            <View style={styles.upcomingHeader}>
              <MaterialIcons name="event-note" size={20} color={theme.primary} />
              <Text style={styles.upcomingTitle}>UPCOMING TOPICS</Text>
            </View>
            
            <TopicItem icon="restaurant" title="Ordering Food" subtitle="20 mins • Tomorrow" />
            <TopicItem icon="directions-bus" title="Asking Directions" subtitle="15 mins • Wed" />
            <TopicItem icon="shopping-bag" title="Market Slang" subtitle="25 mins • Thu" />
          </View>
        </View>

        {/* Character Encouragement */}
        <View style={styles.characterSection}>
          <Image 
            source={{ uri: 'https://api.dicebear.com/7.x/bottts/png?seed=Tarsier' }} 
            style={styles.characterImage} 
          />
          <View style={styles.chatBubble}>
            <View style={styles.chatTriangle} />
            <Text style={styles.chatText}>
              "Ang sipag mo naman! Keep it up, you're doing great with those verb conjugations."
            </Text>
          </View>
        </View>

        {/* Daily Quests Bento Grid */}
        <View style={styles.questsSection}>
          <Text style={styles.questsHeader}>Daily Quests</Text>
          <View style={styles.questsGrid}>
            <QuestCard emoji="🗣️" title="Speak 5 Phrases" subtitle="2/5 Done" />
            <QuestCard emoji="👂" title="Listen & Repeat" subtitle="Locked" />
            <QuestCard emoji="✍️" title="Spelling Bee" subtitle="0/10" />
            <QuestCard emoji="🎁" title="Mystery Box" subtitle="Claim Now" isSpecial />
          </View>
        </View>
        
        {/* Spacer for bottom nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Nav Bar */}
      <View style={styles.bottomNav}>
        <BottomTab icon="home" label="Home" isActive />
        <BottomTab icon="school" label="Lessons" />
        <BottomTab icon="emoji-events" label="Awards" />
        <BottomTab icon="person" label="Profile" />
      </View>
    </SafeAreaView>
  );
}

// Helper Components
const TopicItem = ({ icon, title, subtitle }: { icon: any, title: string, subtitle: string }) => (
  <TouchableOpacity style={styles.topicItem}>
    <View style={styles.topicIconBox}>
      <MaterialIcons name={icon} size={24} color={theme.onSurfaceVariant} />
    </View>
    <View style={styles.topicTextContent}>
      <Text style={styles.topicItemTitle}>{title}</Text>
      <Text style={styles.topicItemSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const QuestCard = ({ emoji, title, subtitle, isSpecial = false }: { emoji: string, title: string, subtitle: string, isSpecial?: boolean }) => (
  <TouchableOpacity style={[styles.questCard, isSpecial && styles.questCardSpecial]}>
    <Text style={styles.questEmoji}>{emoji}</Text>
    <Text style={[styles.questTitle, isSpecial && { color: theme.onSecondary }]}>{title}</Text>
    <Text style={[styles.questSubtitle, isSpecial ? { color: theme.onSecondary } : { color: theme.tertiary }]}>{subtitle}</Text>
  </TouchableOpacity>
);

const BottomTab = ({ icon, label, isActive = false }: { icon: any, label: string, isActive?: boolean }) => (
  <TouchableOpacity style={[styles.bottomTab, isActive && styles.bottomTabActive]}>
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
  textPrimary: {
    color: theme.primary,
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
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
      android: { elevation: 3 },
    }),
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.primary,
    overflow: 'hidden',
  },
  avatar: {
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
    color: theme.primary,
  },
  mainScroll: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.onBackground,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: theme.onSurfaceVariant,
  },
  lessonCard: {
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.outlineVariant,
    marginBottom: 24,
  },
  lessonBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.tertiaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 16,
  },
  lessonBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.onTertiaryContainer,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.onSurface,
    marginBottom: 8,
  },
  lessonDesc: {
    fontSize: 16,
    color: theme.onSurfaceVariant,
    marginBottom: 24,
    lineHeight: 24,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.onSurfaceVariant,
  },
  progressTrack: {
    height: 16,
    backgroundColor: theme.surfaceContainerHighest,
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.tertiary,
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: theme.primaryContainer,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 4,
    borderBottomColor: theme.buttonShadow,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.onPrimaryFixedVariant,
  },
  statsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  streakCard: {
    backgroundColor: theme.primaryContainer,
    padding: 24,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: theme.onPrimaryFixedVariant,
  },
  streakCardLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.onPrimaryContainer,
  },
  streakCardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.onPrimaryContainer,
  },
  streakEmoji: {
    fontSize: 48,
  },
  upcomingCard: {
    backgroundColor: theme.white,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.outlineVariant,
  },
  upcomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  upcomingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.onSurface,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  topicIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicTextContent: {
    flex: 1,
  },
  topicItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.onSurface,
  },
  topicItemSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.onSurfaceVariant,
  },
  characterSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 48,
  },
  characterImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  chatBubble: {
    flex: 1,
    backgroundColor: theme.white,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.outlineVariant,
    position: 'relative',
  },
  chatTriangle: {
    position: 'absolute',
    left: -10,
    top: 24,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 10,
    borderRightWidth: 15,
    borderBottomWidth: 10,
    borderLeftWidth: 0,
    borderTopColor: 'transparent',
    borderRightColor: theme.white,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    zIndex: 1,
  },
  chatText: {
    fontSize: 18,
    lineHeight: 28,
    color: theme.onSurface,
    fontStyle: 'italic',
  },
  questsSection: {
    marginBottom: 24,
  },
  questsHeader: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.onBackground,
    marginBottom: 24,
  },
  questsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  questCard: {
    width: '47%',
    backgroundColor: theme.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: theme.surfaceContainerHigh,
  },
  questCardSpecial: {
    backgroundColor: theme.secondaryContainer,
    borderBottomColor: theme.onSecondaryContainer,
  },
  questEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  questTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.onSurface,
    textAlign: 'center',
    marginBottom: 4,
  },
  questSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
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