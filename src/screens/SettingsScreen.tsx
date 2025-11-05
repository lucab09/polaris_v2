import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useUserStore } from '@store/userStore';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@utils/constants';

const SettingsScreen: React.FC = () => {
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [backgroundSync, setBackgroundSync] = useState(false);
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          await logout();
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingLabel}>User ID</Text>
            </View>
            <Text style={styles.settingValue} numberOfLines={1}>
              {user?.id || 'N/A'}
            </Text>
          </View>
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingLabel}>Created</Text>
            </View>
            <Text style={styles.settingValue}>
              {user ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        </View>

        {/* Sync Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Sync</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Enable Sync</Text>
                <Text style={styles.settingDescription}>Sync data with server</Text>
              </View>
              <Switch
                value={syncEnabled}
                onValueChange={setSyncEnabled}
                trackColor={{
                  false: COLORS.GRAY_300,
                  true: COLORS.PRIMARY_LIGHT,
                }}
                thumbColor={syncEnabled ? COLORS.PRIMARY : COLORS.GRAY_400}
              />
            </View>
          </View>
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Background Sync</Text>
                <Text style={styles.settingDescription}>Sync when app is closed</Text>
              </View>
              <Switch
                value={backgroundSync}
                onValueChange={setBackgroundSync}
                disabled={!syncEnabled}
                trackColor={{
                  false: COLORS.GRAY_300,
                  true: COLORS.PRIMARY_LIGHT,
                }}
                thumbColor={backgroundSync ? COLORS.PRIMARY : COLORS.GRAY_400}
              />
            </View>
          </View>
        </View>

        {/* App Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          <TouchableOpacity style={styles.settingCard} activeOpacity={0.7}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>App Version</Text>
                <Text style={styles.settingDescription}>v0.1.0</Text>
              </View>
              <Text style={styles.settingIcon}>➤</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingCard} activeOpacity={0.7}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>About Polaris</Text>
                <Text style={styles.settingDescription}>Learn more about our mission</Text>
              </View>
              <Text style={styles.settingIcon}>➤</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Documentation Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documentation</Text>
          <TouchableOpacity style={styles.settingCard} activeOpacity={0.7}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Privacy Policy</Text>
              </View>
              <Text style={styles.settingIcon}>➤</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingCard} activeOpacity={0.7}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Terms of Service</Text>
              </View>
              <Text style={styles.settingIcon}>➤</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <TouchableOpacity
            style={[styles.settingCard, styles.dangerCard]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.settingRow}>
              <Text style={styles.dangerText}>Logout</Text>
              <Text style={styles.settingIcon}>➤</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.dangerDescription}>
            You'll be logged out and all local data will be preserved. You can log back in anytime.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ to give you control of your data
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  section: {
    marginBottom: SPACING[6],
  },
  sectionTitle: {
    fontSize: FONT_SIZES.LG,
    fontWeight: '600',
    color: COLORS.GRAY_900,
    marginBottom: SPACING[3],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    borderWidth: 1,
    borderColor: COLORS.GRAY_200,
    marginBottom: SPACING[2],
    padding: SPACING[4],
  },
  settingHeader: {
    marginBottom: SPACING[2],
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: FONT_SIZES.BASE,
    fontWeight: '600',
    color: COLORS.GRAY_900,
    marginBottom: SPACING[1],
  },
  settingDescription: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.GRAY_500,
  },
  settingValue: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.GRAY_600,
    fontFamily: 'Menlo',
  },
  settingIcon: {
    fontSize: FONT_SIZES.LG,
    color: COLORS.GRAY_400,
    marginLeft: SPACING[2],
  },
  dangerCard: {
    backgroundColor: '#FEE2E2',
    borderColor: COLORS.DANGER,
  },
  dangerText: {
    fontSize: FONT_SIZES.BASE,
    fontWeight: '600',
    color: COLORS.DANGER,
  },
  dangerDescription: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.GRAY_500,
    marginTop: SPACING[2],
    marginLeft: SPACING[1],
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING[8],
  },
  footerText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.GRAY_500,
    textAlign: 'center',
  },
});

export default SettingsScreen;
