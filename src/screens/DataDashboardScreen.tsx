import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { storageService } from '@services/storage';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@utils/constants';

interface DataStats {
  locationPoints: number;
  browsingPoints: number;
  totalPoints: number;
}

const DataDashboardScreen: React.FC = () => {
  const [stats, setStats] = useState<DataStats>({
    locationPoints: 0,
    browsingPoints: 0,
    totalPoints: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const locationStats = await storageService.getLocationDataStats();
      const browsingStats = await storageService.getBrowsingDataStats();

      // Simple calculation: each data point = 1 point
      const locationPoints = locationStats.count;
      const browsingPoints = browsingStats.count;

      setStats({
        locationPoints,
        browsingPoints,
        totalPoints: locationPoints + browsingPoints,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Data</Text>
          <Text style={styles.headerSubtitle}>Your data insights and statistics</Text>
        </View>

        {/* Points Card */}
        <View style={styles.pointsCard}>
          <View style={styles.pointsContent}>
            <Text style={styles.pointsLabel}>Total Data Points</Text>
            <Text style={styles.pointsValue}>{stats.totalPoints}</Text>
            <Text style={styles.pointsDescription}>
              Data points collected from your shared activities
            </Text>
          </View>
          <View style={styles.pointsIcon}>
            <Text style={styles.pointsEmoji}>📊</Text>
          </View>
        </View>

        {/* Data Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Breakdown</Text>
          <DataTypeCard
            icon="📍"
            title="Location Data"
            count={stats.locationPoints}
            color={COLORS.PRIMARY}
          />
          <DataTypeCard
            icon="🌐"
            title="Browsing Data"
            count={stats.browsingPoints}
            color={COLORS.SECONDARY}
          />
        </View>

        {/* Data Value */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Data Value</Text>
          <View style={styles.valueCard}>
            <View style={styles.valueItem}>
              <Text style={styles.valueLabel}>This Month</Text>
              <Text style={styles.valueAmount}>$0.00</Text>
            </View>
            <View style={styles.valueDivider} />
            <View style={styles.valueItem}>
              <Text style={styles.valueLabel}>Lifetime</Text>
              <Text style={styles.valueAmount}>$0.00</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={loadStats}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>🔄</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Refresh Data</Text>
              <Text style={styles.actionDescription}>Update statistics</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>⬇️</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Export Data</Text>
              <Text style={styles.actionDescription}>Download your data as JSON</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>🗑️</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Delete Data</Text>
              <Text style={styles.actionDescription}>Clear all local data</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Your data is encrypted and stored locally. It will be automatically deleted based on your retention settings.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface DataTypeCardProps {
  icon: string;
  title: string;
  count: number;
  color: string;
}

const DataTypeCard: React.FC<DataTypeCardProps> = ({ icon, title, count, color }) => (
  <View style={[styles.dataTypeCard, { borderLeftColor: color }]}>
    <Text style={styles.dataTypeIcon}>{icon}</Text>
    <View style={styles.dataTypeContent}>
      <Text style={styles.dataTypeTitle}>{title}</Text>
      <Text style={[styles.dataTypeCount, { color }]}>
        {count} {count === 1 ? 'point' : 'points'}
      </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  pointsCard: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING[4],
    marginBottom: SPACING[6],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsContent: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.WHITE,
    opacity: 0.9,
    marginBottom: SPACING[1],
  },
  pointsValue: {
    fontSize: FONT_SIZES['3XL'],
    fontWeight: '700',
    color: COLORS.WHITE,
    marginBottom: SPACING[2],
  },
  pointsDescription: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.WHITE,
    opacity: 0.8,
  },
  pointsIcon: {
    fontSize: 48,
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
  dataTypeCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    borderLeftWidth: 4,
    padding: SPACING[4],
    marginBottom: SPACING[2],
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.GRAY_200,
  },
  dataTypeIcon: {
    fontSize: 32,
    marginRight: SPACING[3],
  },
  dataTypeContent: {
    flex: 1,
  },
  dataTypeTitle: {
    fontSize: FONT_SIZES.BASE,
    fontWeight: '600',
    color: COLORS.GRAY_900,
  },
  dataTypeCount: {
    fontSize: FONT_SIZES.SM,
    fontWeight: '500',
    marginTop: SPACING[1],
  },
  valueCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    borderWidth: 1,
    borderColor: COLORS.GRAY_200,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  valueItem: {
    flex: 1,
    padding: SPACING[4],
    alignItems: 'center',
  },
  valueDivider: {
    width: 1,
    backgroundColor: COLORS.GRAY_200,
  },
  valueLabel: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.GRAY_500,
    marginBottom: SPACING[1],
  },
  valueAmount: {
    fontSize: FONT_SIZES['2XL'],
    fontWeight: '700',
    color: COLORS.SECONDARY,
  },
  actionButton: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    borderWidth: 1,
    borderColor: COLORS.GRAY_200,
    padding: SPACING[4],
    marginBottom: SPACING[2],
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginRight: SPACING[3],
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: FONT_SIZES.BASE,
    fontWeight: '600',
    color: COLORS.GRAY_900,
  },
  actionDescription: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.GRAY_500,
    marginTop: SPACING[1],
  },
  infoBox: {
    backgroundColor: COLORS.SECONDARY_LIGHT,
    borderRadius: BORDER_RADIUS.LG,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.SECONDARY,
    padding: SPACING[4],
  },
  infoText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.SECONDARY_DARK,
    lineHeight: 20,
  },
});

export default DataDashboardScreen;
