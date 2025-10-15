import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '../constants';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  placeholder?: string;
  style?: any;
  showFilterButton?: boolean;
  onFilterPress?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSearch,
  placeholder = "Search cases...",
  style,
  showFilterButton = false,
  onFilterPress,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSecondary}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSearch}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={onSearch} style={styles.searchButton}>
          <Ionicons name="search" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      {showFilterButton && onFilterPress && (
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Ionicons name="options-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    paddingHorizontal: 15,
    alignItems: 'center',
    minHeight: 44,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 12,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  filterButton: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
});

export default SearchBar;

