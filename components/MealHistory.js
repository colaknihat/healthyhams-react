import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import {MealCard} from './Meal';
import MealManager from './MealManager';
import {useFocusEffect} from '@react-navigation/native';

const MealHistory = ({navigation}) => {
  const [todaysMeals, setTodaysMeals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalNutrition, setTotalNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  const loadTodaysMeals = async () => {
    try {
      await MealManager.loadMealHistory();
      const today = new Date();
      const meals = MealManager.getTodaysMeals(today);
      setTodaysMeals(meals);
      calculateTotalNutrition(meals);
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  };

  const calculateTotalNutrition = (meals) => {
    const total = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal.calory || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fats: acc.fats + (meal.fats || 0),
      }),
      {calories: 0, protein: 0, carbs: 0, fats: 0}
    );
    setTotalNutrition(total);
  };

  const handleDeleteMeal = (mealToDelete) => {
    const today = new Date();
    MealManager.removeMealFromHistory(today, mealToDelete);
    loadTodaysMeals(); // Refresh the list
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTodaysMeals();
    setRefreshing(false);
  }, []);

  // Reload meals when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadTodaysMeals();
    }, [])
  );

  useEffect(() => {
    loadTodaysMeals();
  }, []);

  const formatDate = () => {
    const today = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return today.toLocaleDateString('en-US', options);
  };

  const NutritionSummary = () => (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>Today's Nutrition Summary</Text>
      <View style={styles.nutritionGrid}>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{Math.round(totalNutrition.calories)}</Text>
          <Text style={styles.nutritionLabel}>Calories</Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{Math.round(totalNutrition.protein)}g</Text>
          <Text style={styles.nutritionLabel}>Protein</Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{Math.round(totalNutrition.carbs)}g</Text>
          <Text style={styles.nutritionLabel}>Carbs</Text>
        </View>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{Math.round(totalNutrition.fats)}g</Text>
          <Text style={styles.nutritionLabel}>Fats</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meal History</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.dateSection}>
          <Text style={styles.dateText}>{formatDate()}</Text>
        </View>

        <NutritionSummary />

        <View style={styles.mealsSection}>
          <Text style={styles.sectionTitle}>
            Today's Meals ({todaysMeals.length})
          </Text>
          
          {todaysMeals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No meals added today</Text>
              <Text style={styles.emptyStateSubtext}>
                Go back to the home screen to add meals
              </Text>
            </View>
          ) : (
            todaysMeals.map((meal, index) => (
              <MealCard
                key={`${meal.name}-${index}`}
                meal={meal}
                onDelete={() => handleDeleteMeal(meal)}
              />
            ))
          )}
        </View>
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottom}>
        <View style={styles.navbar}>
          <TouchableOpacity
            style={styles.defaultnavbtn}
            onPress={() => navigation.navigate('HomeScreen')}>
            <Text style={{fontSize: 24, color: '#A5A5A5'}}>🏠</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.defaultnavbtn}
            onPress={() => navigation.navigate('Calendar')}>
            <Text style={{fontSize: 24, color: '#A5A5A5'}}>📅</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.defaultnavbtn}
            onPress={() => navigation.navigate('Overview')}>
            <Image
              style={{width: 25, height: 25}}
              source={require('../assets/icons/ribbon_50px.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.defaultnavbtn}
            onPress={() => navigation.navigate('PersonalSettings')}>
            <Image
              style={{width: 25, height: 25}}
              source={require('../assets/icons/profile_50px.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    flex: 1,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6CC57C',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#23233C',
    flex: 2,
    textAlign: 'center',
  },
  headerSpacer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  dateSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#23233C',
    marginBottom: 15,
    textAlign: 'center',
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6CC57C',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  mealsSection: {
    paddingHorizontal: 20,
    marginBottom: 80,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#23233C',
    marginBottom: 15,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#23233C',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bottom: {
    backgroundColor: 'white',
    width: '100%',
    height: 65,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  defaultnavbtn: {
    padding: 8,
  },
});

export default MealHistory; 