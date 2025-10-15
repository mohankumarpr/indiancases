import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CalendarPickerProps {
  placeholder: string;
  selectedDate?: string;
  onSelect: (date: string) => void;
  style?: any;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  placeholder,
  selectedDate,
  onSelect,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(
    selectedDate ? parseInt(selectedDate) : null
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleSelect = (year: number) => {
    setSelectedYear(year);
    onSelect(year.toString());
    setIsOpen(false);
  };

  const formatDisplayDate = (year: number | null) => {
    return year ? year.toString() : '';
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.datePicker}
        onPress={() => setIsOpen(true)}
      >
        <Text
          style={[
            styles.selectedText,
            !selectedYear && styles.placeholderText,
          ]}
        >
          {formatDisplayDate(selectedYear) || placeholder}
        </Text>
        <Ionicons name="calendar" size={20} color="#999" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Select Year</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsOpen(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.yearsContainer}>
              {years.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.yearButton,
                    selectedYear === year && styles.selectedYearButton,
                  ]}
                  onPress={() => handleSelect(year)}
                >
                  <Text
                    style={[
                      styles.yearText,
                      selectedYear === year && styles.selectedYearText,
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  selectedText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    maxHeight: 400,
    width: '60%',
    maxWidth: 200,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
    } : {
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  yearsContainer: {
    maxHeight: 300,
    padding: 16,
  },
  yearButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 2,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  selectedYearButton: {
    backgroundColor: '#1976d2',
  },
  yearText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedYearText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default CalendarPicker;
