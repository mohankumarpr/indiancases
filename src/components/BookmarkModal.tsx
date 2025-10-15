import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

const { width } = Dimensions.get('window');

interface BookmarkModalProps {
  visible: boolean;
  onClose: () => void;
  caseData?: any;
}

const BookmarkModal: React.FC<BookmarkModalProps> = ({
  visible,
  onClose,
  caseData,
}) => {
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [tags, setTags] = useState([
    { id: 1, name: 'Property', count: 14 },
    { id: 2, name: 'Partition', count: 5 },
    { id: 3, name: 'Inheritance', count: 100 },
    { id: 4, name: 'Income Tax', count: 0 },
  ]);

  const handleAddTag = () => {
    if (newTagName.trim()) {
      const newTag = {
        id: Date.now(),
        name: newTagName.trim(),
        count: 1,
      };
      console.log('Adding new tag:', newTag);
      setTags([...tags, newTag]);
      setNewTagName('');
      setShowAddTag(false);
    } else {
      console.log('Tag name is empty, not adding');
    }
  };

  const handleAddToTag = (tagId: number) => {
    // TODO: Implement add to tag functionality
    console.log('Add case to tag:', tagId);
  };

  const handleDeleteTag = (tagId: number) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  const isDesktop = Platform.OS === 'web' && width > 768;

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
          isDesktop ? styles.modalDesktop : styles.modalMobile
        ]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color="#999" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Ionicons name="bookmark" size={24} color="#333" />
              <View style={styles.headerText}>
                <Text style={styles.bookmarkLabel}>BOOKMARKS:</Text>
                <Text style={styles.assignLabel}>Assign a tag</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.addTagButton}
              onPress={() => setShowAddTag(true)}
            >
              <Ionicons name="bookmark-outline" size={16} color={COLORS.primary} />
              <Text style={styles.addTagText}>Add a new tag</Text>
            </TouchableOpacity>
          </View>

          {/* Add New Tag Input */}
          {showAddTag && (
            <View style={styles.addTagContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="Enter tag name"
                placeholderTextColor="#999"
                value={newTagName}
                onChangeText={setNewTagName}
                autoFocus={true}
                onSubmitEditing={handleAddTag}
                returnKeyType="done"
                blurOnSubmit={false}
              />
              <View style={styles.tagInputActions}>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={handleAddTag}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => {
                    setShowAddTag(false);
                    setNewTagName('');
                  }}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Tags List */}
          <ScrollView style={styles.tagsList} showsVerticalScrollIndicator={false}>
            {tags.map((tag, index) => (
              <View key={tag.id}>
                <View style={[
                  styles.tagItem,
                  isDesktop ? styles.tagItemDesktop : styles.tagItemMobile
                ]}>
                  <View style={styles.tagInfo}>
                    <Text style={styles.tagName}>{tag.name}</Text>
                    <Text style={styles.tagCount}>{tag.count} items</Text>
                  </View>
                  {isDesktop ? (
                    <View style={styles.tagActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleAddToTag(tag.id)}
                      >
                        <Ionicons name="add" size={20} color="#666" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleDeleteTag(tag.id)}
                      >
                        <Ionicons name="trash-outline" size={20} color="#666" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    // Mobile view - show delete button for all tags
                    <TouchableOpacity 
                      style={styles.mobileDeleteButton}
                      onPress={() => handleDeleteTag(tag.id)}
                    >
                      <Ionicons name="trash" size={16} color="white" />
                    </TouchableOpacity>
                  )}
                </View>
                {index < tags.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </ScrollView>
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
    maxHeight: '70%',
    width: '100%',
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
    width: '60%', // 60% width for desktop
  },
  modalMobile: {
    width: '100%', // 100% width for mobile
    marginHorizontal: 0, // No horizontal margins for full width
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 16,
  },
  headerText: {
    marginLeft: 12,
  },
  bookmarkLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  assignLabel: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 2,
  },
  addTagButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addTagText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  addTagContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  tagInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F8F8F8',
    marginBottom: 12,
  },
  tagInputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  clearButtonText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  tagsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  tagItemDesktop: {
    // Desktop styling remains the same
  },
  tagItemMobile: {
    // Mobile styling - simplified layout
    paddingVertical: 20,
  },
  tagInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  tagCount: {
    fontSize: 14,
    color: '#666',
  },
  tagActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  mobileDeleteButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 0,
  },
});

export default BookmarkModal;
