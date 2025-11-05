import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useConsentStore } from '@store/consentStore';
import { ConsentCard } from '@components/ConsentCard';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@utils/constants';

const ConsentsScreen: React.FC = () => {
  const consents = useConsentStore((state) => state.consents);
  const initializeConsents = useConsentStore((state) => state.initializeConsents);
  const toggleConsent = useConsentStore((state) => state.toggleConsent);
  const updateConsent = useConsentStore((state) => state.updateConsent);

  useEffect(() => {
    if (consents.length === 0) {
      initializeConsents();
    }
  }, []);

  const enabledCount = consents.filter((c) => c.enabled).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Privacy Preferences</Text>
          <Text style={styles.headerSubtitle}>
            You control what data you share and with whom
          </Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Data Sharing Status</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusBar}>
              <View
                style={[
                  styles.statusBarFill,
                  { width: `${(enabledCount / consents.length) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.statusText}>
              {enabledCount} of {consents.length} data types enabled
            </Text>
          </View>
          <Text style={styles.infoDescription}>
            All data is stored securely on your device and never shared without your explicit consent.
          </Text>
        </View>

        {/* Consent Cards */}
        <View style={styles.consentsContainer}>
          {consents.map((consent) => (
            <ConsentCard
              key={consent.id}
              consent={consent}
              onToggle={toggleConsent}
              onUpdate={updateConsent}
            />
          ))}
        </View>

        {/* Privacy Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Privacy Tips</Text>
          <PrivacyTip
            title="🔐 Encrypted Storage"
            description="Your data is encrypted end-to-end. Even we cannot see it."
          />
          <PrivacyTip
            title="📱 Local Only"
            description="Data never leaves your device unless you explicitly share it."
          />
          <PrivacyTip
            title="🎛️ Fine Control"
            description="Adjust granularity levels to share only what you're comfortable with."
          />
          <PrivacyTip
            title="🗑️ Auto-Delete"
            description="Data automatically deletes after your chosen retention period."
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface PrivacyTipProps {
  title: string;
  description: string;
}

const PrivacyTip: React.FC<PrivacyTipProps> = ({ title, description }) => (
  <View style={styles.tipCard}>
    <Text style={styles.tipTitle}>{title}</Text>
    <Text style={styles.tipDescription}>{description}</Text>
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
    marginBottom: SPACING[6],
  },
  headerTitle: {
    fontSize: FONT_SIZES['2XL'],
    fontWeight: '700',
    color: COLORS.GRAY_900,
    marginBottom: SPACING[1],
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.BASE,
    color: COLORS.GRAY_500,
  },
  infoCard: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING[4],
    marginBottom: SPACING[6],
    borderLeftWidth: 4,
    borderLeftColor: COLORS.PRIMARY,
  },
  infoTitle: {
    fontSize: FONT_SIZES.BASE,
    fontWeight: '600',
    color: COLORS.PRIMARY_DARK,
    marginBottom: SPACING[3],
  },
  statusContainer: {
    marginBottom: SPACING[3],
  },
  statusBar: {
    height: 8,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING[2],
  },
  statusBarFill: {
    height: '100%',
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 4,
  },
  statusText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.PRIMARY_DARK,
    fontWeight: '500',
  },
  infoDescription: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.PRIMARY_DARK,
    opacity: 0.8,
    lineHeight: 20,
  },
  consentsContainer: {
    marginBottom: SPACING[6],
  },
  tipsSection: {
    marginBottom: SPACING[4],
  },
  tipsTitle: {
    fontSize: FONT_SIZES.LG,
    fontWeight: '600',
    color: COLORS.GRAY_900,
    marginBottom: SPACING[3],
  },
  tipCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING[4],
    marginBottom: SPACING[2],
    borderWidth: 1,
    borderColor: COLORS.GRAY_200,
  },
  tipTitle: {
    fontSize: FONT_SIZES.BASE,
    fontWeight: '600',
    color: COLORS.GRAY_900,
    marginBottom: SPACING[1],
  },
  tipDescription: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.GRAY_600,
    lineHeight: 20,
  },
});

export default ConsentsScreen;
