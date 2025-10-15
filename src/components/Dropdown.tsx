import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DropdownProps {
  placeholder: string;
  options: string[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  style?: any;
  isInsideModal?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  placeholder,
  options,
  selectedValue,
  onSelect,
  style,
  isInsideModal = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };


  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(true)}
      >
        <Text
          style={[
            styles.selectedText,
            !selectedValue && styles.placeholderText,
          ]}
        >
          {selectedValue || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#999" />
      </TouchableOpacity>

        <Modal
          visible={isOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsOpen(false)}
        >
          <TouchableOpacity
            style={[styles.modalOverlay, isInsideModal && styles.modalOverlayInsideModal]}
            activeOpacity={1}
            onPress={() => setIsOpen(false)}
          >
            <View style={styles.modalContent}>
              <ScrollView
                style={styles.optionsList}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                {options.map((item, index) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.option,
                      index === options.length - 1 && styles.lastOption
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
  dropdown: {
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? 200 : 120,
    paddingHorizontal: 20,
  },
  modalOverlayInsideModal: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    maxHeight: 200,
    width: '75%',
    maxWidth: 300,
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
  optionsList: {
    maxHeight: 200,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 15,
    color: '#333',
  },
});

export default Dropdown;
