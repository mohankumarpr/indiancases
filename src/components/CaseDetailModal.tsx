import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS } from '../constants';
import { RootStackParamList } from '../types';

const { width, height } = Dimensions.get('window');

type CaseDetailModalNavigationProp = StackNavigationProp<RootStackParamList>;

interface CaseDetailModalProps {
  visible: boolean;
  onClose: () => void;
  onBookmarkPress: () => void;
  caseData?: any;
}

const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  visible,
  onClose,
  onBookmarkPress,
  caseData,
}) => {
  const navigation = useNavigation<CaseDetailModalNavigationProp>();
  
  if (!caseData) return null;

  const handleViewFullJudgment = () => {
    onClose(); // Close the modal first
    navigation.navigate('Judgment', { caseData });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <View style={[
          styles.modalContainer,
          Platform.OS === 'web' && width > 768 ? styles.modalDesktop : styles.modalMobile
        ]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bookmarkButton} onPress={onBookmarkPress}>
              <Ionicons name="bookmark-outline" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {/* Case Title */}
            <View style={styles.titleSection}>
              <Text style={styles.caseTitle}>{caseData.caseNumber || "2025 (KER) ICO 88888"}</Text>
              <Text style={styles.courtName}>{caseData.court || "Supreme Court of India"}</Text>
            </View>

            {/* Case Details */}
            <View style={styles.detailsSection}>
              {/* Case Number */}
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>CASE NUMBER:</Text>
                <Text style={styles.detailText}>
                  W.P. (C). No. 36659 of 2022{'\n'}
                  W.P. (C). No. 12462 of 2023{'\n'}
                  W.P. (C). No. 13312 of 2023{'\n'}
                  W.P. (C). No. 14576 of 2023{'\n'}
                  W.P. (C). No. 14593 of 2023
                </Text>
              </View>

              {/* Equivalents */}
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>EQUIVALENTS:</Text>
                <Text style={styles.detailText}>Unreported</Text>
              </View>

              {/* For Petitioner/Appellant */}
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>FOR PETITIONER/APPELLANT:</Text>
                <Text style={styles.detailText}>
                  Grashious Kuriakose (DGP){'\n'}
                  P Narayanan (Addl. PP){'\n'}
                  B G Harindranath (Sr. Adv.){'\n'}
                  P Deepak (Amicus Curiae){'\n'}
                  Amith Krishnan H (Adv.)
                </Text>
              </View>

              {/* For Respondent */}
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>FOR RESPONDENT:</Text>
                <Text style={styles.detailText}>
                  Some names{'\n'}
                  Grashious Kuriakose (DGP){'\n'}
                  P Narayanan (Addl. PP){'\n'}
                  B G Harindranath (Sr. Adv.){'\n'}
                  P Deepak (Amicus Curiae){'\n'}
                  Amith Krishnan H (Adv.)
                </Text>
              </View>

              {/* Headnotes */}
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>HEADNOTE(S):</Text>
                <View style={styles.headnotesContainer}>
                  <Text style={styles.headnoteItem}>
                    <Text style={styles.headnoteLetter}>A.</Text> Cess under the{' '}
                    <Text style={styles.highlightedText}>Cess Act read with BOCW Act</Text> is leviable in respect of building and other construction works. Mere installation and/or erection of pipelines, equipments for generation or transmission or distribution of power, electric wires, transmission towers etc.
                  </Text>
                  <Text style={styles.headnoteItem}>
                    <Text style={styles.headnoteLetter}>B.</Text> Mere installation and/or erection of pipelines, equipments{' '}
                    <Text style={styles.highlightedText}>for generation or transmission or distribution of power,</Text> electric wires, transmission towers etc.
                  </Text>
                  <Text style={styles.headnoteItem}>
                    <Text style={styles.headnoteLetter}>C.</Text> Cess under the{' '}
                    <Text style={styles.highlightedText}>Cess Act read with BOCW Act</Text> is leviable in respect
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer Button */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.viewButton} onPress={handleViewFullJudgment}>
              <Ionicons name="search" size={20} color={COLORS.white} />
              <Text style={styles.viewButtonText}>View Full Judgement</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // White blur instead of black
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    ...(Platform.OS === 'web' && {
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    }),
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    maxHeight: '85%',
    // Remove default width - let modalDesktop/modalMobile control width
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0px 15px 50px rgba(0, 0, 0, 0.25)' }
      : {
          elevation: 15,
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: 15 },
          shadowOpacity: 0.25,
          shadowRadius: 25,
        }
    ),
  },
  modalDesktop: {
    width: '60%', // 60% width for desktop, no max-width constraint
  },
  modalMobile: {
    width: '100%', // 100% width for mobile
    marginHorizontal: 0, // No horizontal margins for full width
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 4,
  },
  bookmarkButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  caseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  courtName: {
    fontSize: 16,
    color: COLORS.black,
    textAlign: 'center',
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailItem: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  detailText: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 20,
  },
  headnotesContainer: {
    marginTop: 8,
  },
  headnoteItem: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 22,
    marginBottom: 16,
  },
  headnoteLetter: {
    fontWeight: 'bold',
  },
  highlightedText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  viewButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

export default CaseDetailModal;
