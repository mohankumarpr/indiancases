import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '../constants';
import { RootStackParamList } from '../types';
import Footer from '../components/Footer';
import { useToastMessage } from '../hooks/useToastMessage';

type CaseDetailScreenRouteProp = RouteProp<RootStackParamList, 'CaseDetail'>;

const CaseDetailScreen = () => {
  const route = useRoute<CaseDetailScreenRouteProp>();
  const { showSuccess, showError, showWarning, showInfo } = useToastMessage();
  const { case: caseData } = route.params;

  if (!caseData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, TYPOGRAPHY.h3]}>Case not found</Text>
      </View>
    );
  }

  const handleShare = () => {
    showInfo('Share', 'Share functionality will be implemented');
  };

  const handleBookmark = () => {
    showInfo('Bookmark', 'Bookmark functionality will be implemented');
  };

  const handleDownload = () => {
    if (caseData.pdfUrl) {
      Linking.openURL(caseData.pdfUrl);
    } else {
      showWarning('Download', 'PDF not available for this case');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.caseTitle, TYPOGRAPHY.h2]}>
          {caseData.title}
        </Text>
        <Text style={[styles.caseNumber, TYPOGRAPHY.body]}>
          {caseData.caseNumber}
        </Text>
      </View>

      <View style={styles.actionsBar}>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={20} color={COLORS.primary} />
          <Text style={[styles.actionText, TYPOGRAPHY.caption]}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleBookmark}>
          <Ionicons name="bookmark-outline" size={20} color={COLORS.primary} />
          <Text style={[styles.actionText, TYPOGRAPHY.caption]}>Bookmark</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
          <Ionicons name="download-outline" size={20} color={COLORS.primary} />
          <Text style={[styles.actionText, TYPOGRAPHY.caption]}>Download</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, TYPOGRAPHY.h4]}>Case Overview</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, TYPOGRAPHY.caption]}>Court</Text>
              <Text style={[styles.metaValue, TYPOGRAPHY.body]}>{caseData.court}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, TYPOGRAPHY.caption]}>Judgment Date</Text>
              <Text style={[styles.metaValue, TYPOGRAPHY.body]}>
                {new Date(caseData.dateOfJudgment).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, TYPOGRAPHY.caption]}>Case Category</Text>
              <Text style={[styles.metaValue, TYPOGRAPHY.body]}>{caseData.category}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, TYPOGRAPHY.caption]}>Status</Text>
              <Text style={[
                styles.metaValue, 
                TYPOGRAPHY.body,
                { color: caseData.status === 'Disposed' ? COLORS.success : COLORS.warning }
              ]}>
                {caseData.status}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, TYPOGRAPHY.h4]}>Parties</Text>
          <View style={styles.partyRow}>
            <Text style={[styles.partyLabel, TYPOGRAPHY.body]}>Petitioner:</Text>
            <Text style={[styles.partyValue, TYPOGRAPHY.body]}>{caseData.parties.petitioner}</Text>
          </View>
          <View style={styles.partyRow}>
            <Text style={[styles.partyLabel, TYPOGRAPHY.body]}>Respondent:</Text>
            <Text style={[styles.partyValue, TYPOGRAPHY.body]}>{caseData.parties.respondent}</Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, TYPOGRAPHY.h4]}>Bench</Text>
          {caseData.judges.map((judge: string, index: number) => (
            <Text key={index} style={[styles.judgeName, TYPOGRAPHY.body]}>
              • {judge}
            </Text>
          ))}
        </View>

        <View style={styles.detailSection}>
          <Text style={[styles.sectionTitle, TYPOGRAPHY.h4]}>Case Summary</Text>
          <Text style={[styles.summaryText, TYPOGRAPHY.body]}>
            {caseData.summary}
          </Text>
        </View>

        {caseData.citation && (
          <View style={styles.detailSection}>
            <Text style={[styles.sectionTitle, TYPOGRAPHY.h4]}>Citation</Text>
            <Text style={[styles.citationText, TYPOGRAPHY.body]}>{caseData.citation}</Text>
          </View>
        )}

        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={[styles.buttonText, TYPOGRAPHY.body]}>View Full Judgment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={[styles.secondaryButtonText, TYPOGRAPHY.body]}>Related Cases</Text>
          </TouchableOpacity>
        </View>
      </View>
      {Platform.OS === 'web' && <Footer />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
  },
  header: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginBottom: 1,
  },
  caseTitle: {
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 32,
  },
  caseNumber: {
    color: COLORS.textSecondary,
  },
  actionsBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    color: COLORS.primary,
    marginTop: 4,
  },
  detailsContainer: {
    padding: 20,
  },
  detailSection: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    color: COLORS.text,
    marginBottom: 15,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metaItem: {
    flex: 1,
    marginRight: 10,
  },
  metaLabel: {
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  metaValue: {
    color: COLORS.text,
  },
  partyRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  partyLabel: {
    color: COLORS.textSecondary,
    width: 80,
  },
  partyValue: {
    color: COLORS.text,
    flex: 1,
  },
  judgeName: {
    color: COLORS.text,
    marginBottom: 8,
  },
  summaryText: {
    color: COLORS.text,
    lineHeight: 24,
  },
  citationText: {
    color: COLORS.text,
    fontStyle: 'italic',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default CaseDetailScreen;
