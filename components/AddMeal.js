import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import EdamamApiHelper from './ApiHelper';
import {Meal} from './Meal';
import MealManager from './MealManager';

const AddMeal = ({visible, onClose, selectedDate = null}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a food item to search');
      return;
    }

    setIsLoading(true);
    try {
      const apiData = await EdamamApiHelper.fetchFoodNutrition(searchQuery);
      
      if (apiData && apiData.totalNutrients) {
        const meal = Meal.fromApiData(apiData);
        
        // Use selectedDate if provided, otherwise use today
        const targetDate = selectedDate ? new Date(selectedDate) : new Date();
        MealManager.addToMealHistory(targetDate, meal);
        
        // Clear the search and close modal
        setSearchQuery('');
        onClose();
      } else {
        Alert.alert(
          'No Results',
          'No nutrition data found. Try being more specific (e.g., "100g chicken breast").'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch nutrition data. Please try again.');
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Meal</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter food item (e.g., 100g steak)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoFocus={true}
            />
            
            <TouchableOpacity
              style={[styles.searchButton, isLoading && styles.searchButtonDisabled]}
              onPress={handleSearch}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.searchButtonText}>Add Meal</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#23233C',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 15,
  },
  searchButton: {
    backgroundColor: '#6CC57C',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddMeal; 