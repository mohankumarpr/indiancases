import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import { RootStackParamList } from '../types';
import BottomNavigation from '../components/BottomNavigation';

type JudgmentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Judgment'>;
type JudgmentScreenRouteProp = RouteProp<RootStackParamList, 'Judgment'>;

const JudgmentScreen = () => {
  const navigation = useNavigation<JudgmentScreenNavigationProp>();
  const route = useRoute<JudgmentScreenRouteProp>();

  const caseData = route.params?.caseData || {};

  const handleEmailJudgment = () => {
    // TODO: Implement email functionality
    console.log('Email judgment');
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download functionality
    console.log('Download PDF');
  };

  const renderHighlightedText = (text: string) => {
    const legalTerms = [
      'Motor Accidents Claims Tribunal',
      'High Court',
      'Indian Succession Act, 1925',
      'Madhya Pradesh High Court',
      'Motor Vehicles Act, 1988',
      'Section 166',
      'Act 32 of 2019',
      'Section 167',
      'Kahlon @ Jasmail Singh Kahlon',
      'Meena',
      'Oriental Insurance Company Limited',
      'Supreme Court',
      'Constitution',
      'Article',
      'Section',
      'Act',
      'Code',
      'IPC',
      'CrPC',
      'Sections?',
      'Articles?'
    ];

    let highlightedText = text;
    legalTerms.forEach(term => {
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `__HIGHLIGHT__$&__END_HIGHLIGHT__`);
    });

    const parts = highlightedText.split(/(__HIGHLIGHT__.*?__END_HIGHLIGHT__)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('__HIGHLIGHT__') && part.endsWith('__END_HIGHLIGHT__')) {
        const cleanText = part.replace(/__HIGHLIGHT__|__END_HIGHLIGHT__/g, '');
        return (
          <Text key={index} style={styles.highlightedText}>
            {cleanText}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  const judgmentText = `1. The present appeal arises out of the judgment and order dated 21.02.2020 passed by the Motor Accidents Claims Tribunal, Indore in Claim Case No. 248/2018, whereby the Tribunal has awarded a compensation of Rs. 8,00,000/- along with interest @ 9% per annum from the date of filing of the claim petition till realization.

2. The brief facts of the case are that on 06.06.2018, the deceased was traveling in a car bearing registration No. MP-09-CA-1234, when the said car met with an accident with a truck bearing registration No. MP-09-GA-5678. The deceased succumbed to the injuries sustained in the accident.

3. The claimants filed a claim petition before the Motor Accidents Claims Tribunal, Indore claiming compensation under various heads. The Tribunal after considering the evidence on record, awarded a total compensation of Rs. 8,00,000/-.

4. The learned counsel for the appellant has submitted that the Tribunal has not properly considered the income of the deceased and has awarded inadequate compensation. It is submitted that the deceased was working as a Software Engineer in a reputed IT company and was earning Rs. 25,000/- per month.

5. The learned counsel for the respondent Insurance Company has submitted that the Tribunal has already awarded just and reasonable compensation and there is no need to interfere with the same.

6. We have heard the learned counsel for the parties and perused the material on record. The Motor Vehicles Act, 1988 provides for compensation to the victims of motor vehicle accidents. Section 166 of the Act provides for application for compensation.

7. The Supreme Court in various decisions has held that the compensation should be just and reasonable and should not be either inadequate or excessive. The principles for determination of compensation have been laid down in various decisions of the Supreme Court.

8. In the present case, the deceased was 28 years old at the time of accident and was working as a Software Engineer. The Tribunal has considered the income of the deceased as Rs. 15,000/- per month. However, considering the evidence on record, we are of the opinion that the income should be considered as Rs. 20,000/- per month.

9. The future prospects at the rate of 40% should be added to the income of the deceased as he was below 40 years of age. Thus, the monthly income would be Rs. 28,000/- (Rs. 20,000/- + 40% of Rs. 20,000/-).

10. The annual income would be Rs. 3,36,000/- (Rs. 28,000/- × 12). After deducting 1/4th towards personal expenses, the annual dependency would be Rs. 2,52,000/-.

11. The multiplier of 17 should be applied considering the age of the deceased. Thus, the compensation under the head of loss of dependency would be Rs. 42,84,000/- (Rs. 2,52,000/- × 17).

12. In addition to the above, the claimants are entitled to compensation under conventional heads like loss of estate, loss of consortium, and funeral expenses.

13. Accordingly, the total compensation is enhanced to Rs. 45,00,000/- along with interest @ 9% per annum from the date of filing of the claim petition till realization.

14. The appeal is allowed in part. The impugned judgment and order of the Tribunal is modified to the extent that the total compensation is enhanced from Rs. 8,00,000/- to Rs. 45,00,000/- along with interest @ 9% per annum from the date of filing of the claim petition till realization.

15. The respondent Insurance Company is directed to deposit the enhanced amount of compensation within a period of two months from today, failing which the same shall carry interest @ 12% per annum from the date of this order till realization.`;

  return (
    <View style={styles.container}>
      {/* Top Header with Logo */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../assets/logo.svg')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Indian Cases</Text>
        </View>
      </View>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Judgement</Text>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Ionicons name="bookmark-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content Area */}
      <View style={styles.scrollContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={Platform.OS !== 'web'}
          bounces={true}
          scrollEnabled={true}
          nestedScrollEnabled={true}
        >
          {/* Judgment Header */}
          <View style={styles.judgmentHeader}>
            <Text style={styles.judgmentId}>2025 (KER) ICO 88888</Text>
            <Text style={styles.courtName}>Supreme Court of India</Text>
            <Text style={styles.decisionDate}>Decided on 15-05-2025</Text>
            <Text style={styles.judges}>Justice Bela M Trivedi, Justice Prasanna B Varale</Text>
            <Text style={styles.caseTitle}>
              In Re Alarming Rise In The Number of Reported Child Rape Incidents Vs. Pratishtha Thakur Haritwal
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.emailButton} onPress={handleEmailJudgment}>
              <Ionicons name="mail-outline" size={20} color={COLORS.white} />
              <Text style={styles.emailButtonText}>Email Judgement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadPDF}>
              <Ionicons name="download-outline" size={20} color="#333" />
              <Text style={styles.downloadButtonText}>Download PDF</Text>
            </TouchableOpacity>
          </View>

          {/* Judgment Text */}
          <View style={styles.judgmentTextContainer}>
            <Text style={styles.judgmentLabel}>JUDGEMENT:</Text>
            <View style={styles.judgmentTextContent}>
              {renderHighlightedText(judgmentText)}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab="search"
        onNavigate={(tab) => {
          if (tab === 'home') {
            navigation.navigate('Home');
          } else if (tab === 'search') {
            navigation.navigate('Search', {
              query: '',
              filters: {
                court: undefined,
                year: new Date().getFullYear(),
                category: undefined,
              }
            });
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  topHeader: {
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'web' ? 20 : Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 32,
    height: 32,
    marginRight: 12,
    tintColor: '#333',
  },
  headerTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  navBar: {
    backgroundColor: COLORS.white,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 4,
  },
  navTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  bookmarkButton: {
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingBottom: 100, // Space for footer
    paddingHorizontal: 40, // Left and right indentation
  },
  judgmentHeader: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  judgmentId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  courtName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  decisionDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  judges: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  caseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    gap: 16,
  },
  emailButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emailButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  downloadButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  downloadButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  judgmentTextContainer: {
    paddingVertical: 20,
  },
  judgmentLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  judgmentTextContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  highlightedText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default JudgmentScreen;
