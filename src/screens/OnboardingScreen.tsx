import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useUserStore } from '@store/userStore';
import { useConsentStore } from '@store/consentStore';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@utils/constants';

const OnboardingScreen: React.FC = () => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const userStore = useUserStore();
  const consentStore = useConsentStore();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    setIsLoading(true);
    try {
      await userStore.initializeUser();
      await consentStore.initializeConsents();
    } catch (error) {
      console.error('Initialization error:', error);
    }
    setIsLoading(false);
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    try {
      userStore.setIsOnboarded(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && step === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {step === 0 && <WelcomeStep />}
      {step === 1 && <PrivacyStep />}
      {step === 2 && <FeaturesStep />}

      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleNext}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.WHITE} />
          ) : (
            <Text style={styles.buttonText}>
              {step === 2 ? 'Get Started' : 'Next'}
            </Text>
          )}
        </TouchableOpacity>

        {step > 0 && (
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => setStep(step - 1)}
            disabled={isLoading}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.dotContainer}>
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === step && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const WelcomeStep: React.FC = () => (
  <View style={styles.stepContainer}>
    <View style={styles.iconContainer}>
      <Text style={styles.icon}>🔐</Text>
    </View>
    <Text style={styles.stepTitle}>Welcome to Polaris</Text>
    <Text style={styles.stepDescription}>
      Take control of your data. Share what you want, earn rewards, and keep your privacy.
    </Text>
    <View style={styles.featuresList}>
      <FeatureItem icon="✓" text="Own your data" />
      <FeatureItem icon="✓" text="Earn rewards" />
      <FeatureItem icon="✓" text="Stay private" />
    </View>
  </View>
);

const PrivacyStep: React.FC = () => (
  <View style={styles.stepContainer}>
    <View style={styles.iconContainer}>
      <Text style={styles.icon}>🛡️</Text>
    </View>
    <Text style={styles.stepTitle}>Your Privacy Matters</Text>
    <Text style={styles.stepDescription}>
      All your data is stored locally on your phone. You decide exactly what to share and with whom.
    </Text>
    <View style={styles.privacyFeatures}>
      <PrivacyFeature title="End-to-End Encrypted" description="Only you can read your data" />
      <PrivacyFeature title="Local Storage" description="Nothing leaves your device without permission" />
      <PrivacyFeature title="Granular Control" description="Choose what data to share and how detailed" />
    </View>
  </View>
);

const FeaturesStep: React.FC = () => (
  <View style={styles.stepContainer}>
    <View style={styles.iconContainer}>
      <Text style={styles.icon}>⭐</Text>
    </View>
    <Text style={styles.stepTitle}>Earn Rewards</Text>
    <Text style={styles.stepDescription}>
      Share your data with companies that value your privacy and get rewarded fairly.
    </Text>
    <View style={styles.rewardsList}>
      <RewardItem title="Location Data" value="Get insights worth more" />
      <RewardItem title="Browsing Habits" value="Help improve services" />
      <RewardItem title="Preferences" value="Receive better recommendations" />
    </View>
  </View>
);

const FeatureItem: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const PrivacyFeature: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <View style={styles.privacyFeature}>
    <Text style={styles.privacyTitle}>{title}</Text>
    <Text style={styles.privacyDescription}>{description}</Text>
  </View>
);

const RewardItem: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <View style={styles.rewardItem}>
    <Text style={styles.rewardTitle}>{title}</Text>
    <Text style={styles.rewardValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  contentContainer: {
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[8],
    paddingBottom: SPACING[12],
  },
  stepContainer: {
    paddingVertical: SPACING[4],
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: SPACING[6],
  },
  icon: {
    fontSize: 64,
  },
  stepTitle: {
    fontSize: FONT_SIZES['3XL'],
    fontWeight: '700',
    color: COLORS.GRAY_900,
    marginBottom: SPACING[2],
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: FONT_SIZES.BASE,
    color: COLORS.GRAY_600,
    textAlign: 'center',
    marginBottom: SPACING[6],
    lineHeight: 24,
  },
  featuresList: {
    gap: SPACING[3],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING[3],
    padding: SPACING[3],
    backgroundColor: COLORS.GRAY_50,
    borderRadius: BORDER_RADIUS.LG,
  },
  featureIcon: {
    fontSize: FONT_SIZES.XL,
  },
  featureText: {
    fontSize: FONT_SIZES.BASE,
    fontWeight: '500',
    color: COLORS.GRAY_900,
  },
  privacyFeatures: {
    gap: SPACING[3],
  },
  privacyFeature: {
    padding: SPACING[4],
    backgroundColor: COLORS.PRIMARY_LIGHT,
    borderRadius: BORDER_RADIUS.LG,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.PRIMARY,
  },
  privacyTitle: {
    fontSize: FONT_SIZES.BASE,
    fontWeight: '600',
    color: COLORS.PRIMARY_DARK,
    marginBottom: SPACING[1],
  },
  privacyDescription: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.PRIMARY_DARK,
    opacity: 0.8,
  },
  rewardsList: {
    gap: SPACING[3],
  },
  rewardItem: {
    padding: SPACING[4],
    backgroundColor: COLORS.SECONDARY_LIGHT,
    borderRadius: BORDER_RADIUS.LG,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.SECONDARY,
  },
  rewardTitle: {
    fontSize: FONT_SIZES.BASE,
    fontWeight: '600',
    color: COLORS.SECONDARY_DARK,
    marginBottom: SPACING[1],
  },
  rewardValue: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.SECONDARY_DARK,
    opacity: 0.8,
  },
  footerContainer: {
    gap: SPACING[3],
  },
  button: {
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[4],
    borderRadius: BORDER_RADIUS.LG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  buttonText: {
    fontSize: FONT_SIZES.BASE,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  secondaryButton: {
    backgroundColor: COLORS.GRAY_100,
    borderWidth: 1,
    borderColor: COLORS.GRAY_300,
  },
  secondaryButtonText: {
    fontSize: FONT_SIZES.BASE,
    fontWeight: '600',
    color: COLORS.GRAY_900,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING[2],
    marginTop: SPACING[6],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.GRAY_300,
  },
  activeDot: {
    backgroundColor: COLORS.PRIMARY,
    width: 24,
  },
});

export default OnboardingScreen;
