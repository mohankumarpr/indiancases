import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '../constants';
import { Case } from '../types';

interface CaseCardProps {
  caseData: Case;
  onPress: () => void;
}

const CaseCard: React.FC<CaseCardProps> = ({ caseData, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={[styles.title, TYPOGRAPHY.h4]} numberOfLines={2}>
          {caseData.title}
        </Text>
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, TYPOGRAPHY.caption]}>Court</Text>
            <Text style={[styles.metaValue, TYPOGRAPHY.caption]}>{caseData.court}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, TYPOGRAPHY.caption]}>Date</Text>
            <Text style={[styles.metaValue, TYPOGRAPHY.caption]}>
              {new Date(caseData.dateOfJudgment).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, TYPOGRAPHY.caption]}>Status</Text>
            <Text style={[
              styles.metaValue,
              styles.status,
              { color: caseData.status === 'Disposed' ? COLORS.success : COLORS.warning }
            ]}>
              {caseData.status}
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={[styles.summary, TYPOGRAPHY.body]} numberOfLines={3}>
        {caseData.summary}
      </Text>
      
      <View style={styles.footer}>
        <View style={styles.categoryBadge}>
          <Text style={[styles.categoryText, TYPOGRAPHY.caption]}>{caseData.category}</Text>
        </View>
        <View style={styles.citationContainer}>
          <Ionicons name="bookmark-outline" size={14} color={COLORS.gray} />
          <Text style={[styles.citationText, TYPOGRAPHY.caption]}>{caseData.citation}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }
      : {
          elevation: 2,
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }
    ),
  },
  header: {
    marginBottom: 12,
  },
  title: {
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    minWidth: 60,
  },
  metaLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginBottom: 2,
  },
  metaValue: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '500',
  },
  status: {
    fontWeight: 'bold',
  },
  summary: {
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  citationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  citationText: {
    color: COLORS.gray,
  },
});

export default CaseCard;
