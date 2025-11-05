import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Consent } from '@types/index';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@utils/constants';
import { capitalize } from '@utils/helpers';

interface ConsentCardProps {
  consent: Consent;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Consent>) => void;
}

export const ConsentCard: React.FC<ConsentCardProps> = ({ consent, onToggle, onUpdate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleToggle = () => {
    onToggle(consent.id);
  };

  const handleGranularityChange = (granularity: 'precise' | 'approximate' | 'none') => {
    onUpdate(consent.id, { granularity });
    setIsModalVisible(false);
  };

  const handleBackgroundToggle = () => {
    onUpdate(consent.id, { allowBackground: !consent.allowBackground });
  };

  const getGranularityLabel = (granularity: string): string => {
    switch (granularity) {
      case 'precise':
        return 'Precise (High accuracy)';
      case 'approximate':
        return 'Approximate (City level)';
      case 'none':
        return 'None (No data)';
      default:
        return granularity;
    }
  };

  const getConsentDescription = (type: string): string => {
    switch (type) {
      case 'location':
        return 'Share your location for location-based services';
      case 'browsing':
        return 'Share your browsing history for better recommendations';
      case 'search':
        return 'Share your search queries for improved results';
      case 'purchases':
        return 'Share your purchase history for personalized offers';
      default:
        return '';
    }
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{capitalize(consent.type)}</Text>
            <Text style={styles.description}>{getConsentDescription(consent.type)}</Text>
          </View>
          <Switch
            value={consent.enabled}
            onValueChange={handleToggle}
            trackColor={{
              false: COLORS.GRAY_300,
              true: COLORS.PRIMARY_LIGHT,
            }}
            thumbColor={consent.enabled ? COLORS.PRIMARY : COLORS.GRAY_400}
          />
        </View>

        {consent.enabled && (
          <View style={styles.settingsContainer}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setIsModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.settingLabel}>Granularity</Text>
              <Text style={styles.settingValue}>{getGranularityLabel(consent.granularity)}</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.backgroundLabelContainer}>
                <Text style={styles.settingLabel}>Background Tracking</Text>
                <Text style={styles.settingDescription}>
                  Allow data collection in the background
                </Text>
              </View>
              <Switch
                value={consent.allowBackground}
                onValueChange={handleBackgroundToggle}
                trackColor={{
                  false: COLORS.GRAY_300,
                  true: COLORS.PRIMARY_LIGHT,
                }}
                thumbColor={consent.allowBackground ? COLORS.PRIMARY : COLORS.GRAY_400}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Data Retention</Text>
              <Text style={styles.settingValue}>
                {consent.dataRetention === 999999 ? 'Indefinite' : `${consent.dataRetention} days`}
              </Text>
            </View>
          </View>
        )}
      </View>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Granularity Level</Text>

            <TouchableOpacity
              style={[
                styles.optionButton,
                consent.granularity === 'precise' && styles.optionButtonActive,
              ]}
              onPress={() => handleGranularityChange('precise')}
            >
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionLabel,
                    consent.granularity === 'precise' && styles.optionLabelActive,
                  ]}
                >
                  Precise
                </Text>
                <Text style={styles.optionDescription}>
                  High accuracy - exact location coordinates
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                consent.granularity === 'approximate' && styles.optionButtonActive,
              ]}
              onPress={() => handleGranularityChange('approximate')}
            >
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionLabel,
                    consent.granularity === 'approximate' && styles.optionLabelActive,
                  ]}
                >
                  Approximate
                </Text>
                <Text style={styles.optionDescription}>
                  City level - your general area only
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                consent.granularity === 'none' && styles.optionButtonActive,
              ]}
              onPress={() => handleGranularityChange('none')}
            >
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionLabel,
                    consent.granularity === 'none' && styles.optionLabelActive,
                  ]}
                >
                  None
                </Text>
                <Text style={styles.optionDescription}>
                  No data sharing - maximum privacy
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    borderWidth: 1,
    borderColor: COLORS.GRAY_200,
    marginBottom: SPACING[4],
    overflow: 'hidden',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING[4],
  },
  titleContainer: {
    flex: 1,
    marginRight: SPACING[3],
  },
  title: {
    fontSize: FONT_SIZES.LG,
    fontWeight: '600',
    color: COLORS.GRAY_900,
    marginBottom: SPACING[1],
  },
  description: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.GRAY_500,
  },
  settingsContainer: {
    backgroundColor: COLORS.GRAY_50,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY_200,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING[4],
  },
  settingLabel: {
    fontSize: FONT_SIZES.BASE,
    fontWeight: '500',
    color: COLORS.GRAY_900,
  },
  settingValue: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.GRAY_500,
    marginTop: SPACING[1],
  },
  backgroundLabelContainer: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.GRAY_200,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: BORDER_RADIUS.XL,
    borderTopRightRadius: BORDER_RADIUS.XL,
    paddingTop: SPACING[6],
    paddingHorizontal: SPACING[4],
    paddingBottom: SPACING[6],
  },
  modalTitle: {
    fontSize: FONT_SIZES.XL,
    fontWeight: '600',
    color: COLORS.GRAY_900,
    marginBottom: SPACING[4],
    textAlign: 'center',
  },
  optionButton: {
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[4],
    marginBottom: SPACING[2],
    borderRadius: BORDER_RADIUS.LG,
    backgroundColor: COLORS.GRAY_100,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonActive: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    borderColor: COLORS.PRIMARY,
  },
  optionContent: {
    gap: SPACING[1],
  },
  optionLabel: {
    fontSize: FONT_SIZES.BASE,
    fontWeight: '600',
    color: COLORS.GRAY_900,
  },
  optionLabelActive: {
    color: COLORS.PRIMARY_DARK,
  },
  optionDescription: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.GRAY_500,
  },
  closeButton: {
    marginTop: SPACING[4],
    paddingVertical: SPACING[3],
    backgroundColor: COLORS.GRAY_200,
    borderRadius: BORDER_RADIUS.LG,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: FONT_SIZES.BASE,
    fontWeight: '600',
    color: COLORS.GRAY_900,
  },
});
