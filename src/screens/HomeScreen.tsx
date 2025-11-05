import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useUserStore } from '@store/userStore';
import { useConsentStore } from '@store/consentStore';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@utils/constants';

const HomeScreen: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const consents = useConsentStore((state) => state.consents);
  const initializeConsents = useConsentStore((state) => state.initializeConsents);

  useEffect(() => {
    initializeConsents();
  }, []);

  const enabledConsents = consents.filter((c) => c.enabled).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Your data is secure and under your control</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Privacy Level</Text>
            <Text style={styles.statusValue}>Excellent</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Data Shared</Text>
            <Text style={styles.statusValue}>{enabledConsents}/3</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Earned Today</Text>
            <Text style={styles.statusValue}>0 POL</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <ActionButton
              icon="🎯"
              title="Privacy Settings"
              description="Manage what you share"
            />
            <ActionButton icon="📊" title="View My Data" description="See your insights" />
            <ActionButton icon="💰" title="Earn Rewards" description="Check your balance" />
            <ActionButton icon="⚙️" title="Settings" description="App preferences" />
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.infoCard}>
            <InfoStep number={1} title="Control" description="Choose what data to share" />
            <InfoStep number={2} title="Store" description="Data stored safely on your device" />
            <InfoStep number={3} title="Earn" description="Get rewarded for your data" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface ActionButtonProps {
  icon: string;
  title: string;
  description: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, title, description }) => (
  <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
    <Text style={styles.actionIcon}>{icon}</Text>
    <Text style={styles.actionTitle}>{title}</Text>
    <Text style={styles.actionDescription}>{description}</Text>
  </TouchableOpacity>
);

interface InfoStepProps {
  number: number;
  title: string;
  description: string;
}

const InfoStep: React.FC<InfoStepProps> = ({ number, title, description }) => (
  <View style={styles.infoStep}>
    <View style={styles.stepNumber}>
      <Text style={styles.stepNumberText}>{number}</Text>
    </View>
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.GRAY_50,
  },
  scrollContent: {
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[4],
    paddingBottom: SPACING[8],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING[6],
  },
  greeting: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES['2XL'],
    fontWeight: '700',
    color: COLORS.GRAY_900,
    marginBottom: SPACING[1],
  },
  subtitle: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.GRAY_500,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZES.XL,
  },
  statusCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    flexDirection: 'row',
    marginBottom: SPACING[6],
    borderWidth: 1,
    borderColor: COLORS.GRAY_200,
    overflow: 'hidden',
  },
  statusItem: {
    flex: 1,
    padding: SPACING[4],
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.GRAY_500,
    fontWeight: '500',
    marginBottom: SPACING[1],
  },
  statusValue: {
    fontSize: FONT_SIZES.LG,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.GRAY_200,
  },
  section: {
    marginBottom: SPACING[6],
  },
  sectionTitle: {
    fontSize: FONT_SIZES.LG,
    fontWeight: '600',
    color: COLORS.GRAY_900,
    marginBottom: SPACING[3],
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING[3],
  },
  actionButton: {
    flex: 0.48,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING[3],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.GRAY_200,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: SPACING[2],
  },
  actionTitle: {
    fontSize: FONT_SIZES.SM,
    fontWeight: '600',
    color: COLORS.GRAY_900,
    marginBottom: SPACING[1],
  },
  actionDescription: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.GRAY_500,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING[4],
    borderWidth: 1,
    borderColor: COLORS.GRAY_200,
  },
  infoStep: {
    flexDirection: 'row',
    marginBottom: SPACING[3],
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING[3],
  },
  stepNumberText: {
    color: COLORS.WHITE,
    fontWeight: '700',
    fontSize: FONT_SIZES.BASE,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: FONT_SIZES.BASE,
    fontWeight: '600',
    color: COLORS.GRAY_900,
    marginBottom: SPACING[1],
  },
  stepDescription: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.GRAY_500,
  },
});

export default HomeScreen;
