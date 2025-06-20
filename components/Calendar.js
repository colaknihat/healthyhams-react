import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import {Calendar as ReactNativeCalendar} from 'react-native-calendars';
import {useFocusEffect} from '@react-navigation/native';
import MealManager from './MealManager';
import AddMeal from './AddMeal';

const {width: screenWidth} = Dimensions.get('window');

const Calendar = ({navigation, route}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [mealData, setMealData] = useState({});
  const [selectedDayMeals, setSelectedDayMeals] = useState(null);
  const [showAddMealModal, setShowAddMealModal] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const loadMealData = async (preserveSelectedDate = false) => {
    try {
      await MealManager.loadMealHistory();
      const allMealHistory = MealManager.getAllMealHistory();
      
      // Convert meal history to calendar format
      const calendarMealData = {};
      const marked = {};
      
      allMealHistory.forEach((meals, dateKey) => {
        if (meals && meals.length > 0) {
          // Calculate total nutrition for the day
          const totalNutrition = meals.reduce(
            (acc, meal) => ({
              calories: acc.calories + (meal.calory || 0),
              protein: acc.protein + (meal.protein || 0),
              carbs: acc.carbs + (meal.carbs || 0),
              fat: acc.fat + (meal.fats || 0),
            }),
            {calories: 0, protein: 0, carbs: 0, fat: 0}
          );
          
          calendarMealData[dateKey] = {
            meals: meals.map(meal => meal.name),
            mealObjects: meals, // Keep full meal objects for detailed view
            calories: Math.round(totalNutrition.calories),
            protein: Math.round(totalNutrition.protein),
            carbs: Math.round(totalNutrition.carbs),
            fat: Math.round(totalNutrition.fat),
          };
          
          // Mark dates with meals
          marked[dateKey] = {
            marked: true,
            dotColor: '#6CC57C',
            activeOpacity: 0.7,
          };
        }
      });
      
      setMealData(calendarMealData);
      
      if (!preserveSelectedDate) {
        // Auto-select today's date only on initial load
        const todayString = getTodayString();
        setSelectedDate(todayString);
        
        // Add today's selection to marked dates
        marked[todayString] = {
          ...marked[todayString],
          selected: true,
          selectedColor: '#6CC57C',
        };
        
        setMarkedDates(marked);
        
        // Show today's meal data
        if (calendarMealData[todayString]) {
          setSelectedDayMeals(calendarMealData[todayString]);
        } else {
          setSelectedDayMeals({
            meals: [],
            mealObjects: [],
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
          });
        }
      } else {
        // Preserve current selection and update marked dates
        const currentSelectedDate = selectedDate;
        
        // Add current selection to marked dates
        if (currentSelectedDate) {
          marked[currentSelectedDate] = {
            ...marked[currentSelectedDate],
            selected: true,
            selectedColor: '#6CC57C',
          };
        }
        
        setMarkedDates(marked);
        
        // Update selected day meals with new data
        if (currentSelectedDate && calendarMealData[currentSelectedDate]) {
          setSelectedDayMeals(calendarMealData[currentSelectedDate]);
        } else if (currentSelectedDate) {
          setSelectedDayMeals({
            meals: [],
            mealObjects: [],
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
          });
        }
      }
    } catch (error) {
      console.error('Error loading meal data for calendar:', error);
    }
  };

  // Reload meal data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadMealData();
    }, [])
  );

  useEffect(() => {
    loadMealData();
  }, []);

  const onDayPress = (day) => {
    const dateString = day.dateString;
    setSelectedDate(dateString);
    
    // Update marked dates to show selection
    const newMarkedDates = {...markedDates};
    
    // Remove previous selection
    Object.keys(newMarkedDates).forEach(date => {
      if (newMarkedDates[date].selected) {
        delete newMarkedDates[date].selected;
        delete newMarkedDates[date].selectedColor;
      }
    });
    
    // Add new selection
    newMarkedDates[dateString] = {
      ...newMarkedDates[dateString],
      selected: true,
      selectedColor: '#6CC57C',
    };
    
    setMarkedDates(newMarkedDates);
    
    // Show meal data if available, otherwise show empty data
    if (mealData[dateString]) {
      setSelectedDayMeals(mealData[dateString]);
    } else {
      setSelectedDayMeals({
        meals: [],
        mealObjects: [],
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <ScrollView style={styles.content}>
          <View style={styles.calendarContainer}>
            <ReactNativeCalendar
              onDayPress={onDayPress}
              markedDates={markedDates}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#b6c1cd',
                selectedDayBackgroundColor: '#6CC57C',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#6CC57C',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                dotColor: '#6CC57C',
                selectedDotColor: '#ffffff',
                arrowColor: '#6CC57C',
                disabledArrowColor: '#d9e1e8',
                monthTextColor: '#2d4150',
                indicatorColor: '#6CC57C',
                textDayFontFamily: 'System',
                textMonthFontFamily: 'System',
                textDayHeaderFontFamily: 'System',
                textDayFontWeight: '300',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '300',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 13,
              }}
              style={styles.calendar}
            />
          </View>

          {/* Meal History Section */}
          {selectedDayMeals && (
            <View style={styles.mealHistoryContainer}>
              <View style={styles.nutritionSummary}>
                <Text style={styles.summaryTitle}>Nutrition Summary</Text>
                <View style={styles.nutritionRow}>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{selectedDayMeals.calories}</Text>
                    <Text style={styles.nutritionLabel}>Calories</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{selectedDayMeals.protein}g</Text>
                    <Text style={styles.nutritionLabel}>Protein</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{selectedDayMeals.carbs}g</Text>
                    <Text style={styles.nutritionLabel}>Carbs</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{selectedDayMeals.fat}g</Text>
                    <Text style={styles.nutritionLabel}>Fat</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.mealsSection}>
                <Text style={styles.mealsTitle}>Meals ({selectedDayMeals.meals.length})</Text>
                <View style={styles.singleline} />
                
                {selectedDayMeals.meals.length === 0 ? (
                  <View style={styles.emptyMealsState}>
                    <Text style={styles.emptyMealsText}>No meals recorded for this date</Text>
                    <Text style={styles.emptyMealsSubtext}>Tap the + button to add meals</Text>
                  </View>
                ) : (
                  <ScrollView style={styles.mealsScroll} showsVerticalScrollIndicator={false}>
                    {selectedDayMeals.mealObjects.map((meal, index) => (
                      <View key={index} style={styles.mealItem}>
                        <View style={styles.mealInfo}>
                          <Text style={styles.mealName}>{meal.name}</Text>
                          <View style={styles.mealNutrition}>
                            <Text style={styles.mealCalories}>{meal.calory} cal</Text>
                            <Text style={styles.mealMacros}>
                              {meal.protein}p • {meal.carbs}c • {meal.fats}f
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.deleteMealButton}
                          onPress={() => {
                            Alert.alert(
                              'Delete Meal',
                              'Are you sure you want to delete this meal?',
                              [
                                {text: 'Cancel', style: 'cancel'},
                                {
                                  text: 'Delete',
                                  style: 'destructive',
                                  onPress: () => {
                                    const targetDate = new Date(selectedDate);
                                    MealManager.removeMealFromHistory(targetDate, meal);
                                    loadMealData(true);
                                  },
                                },
                              ]
                            );
                          }}>
                          <Text style={styles.deleteMealButtonText}>×</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>
            </View>
          )}
        </ScrollView>
        
        {/* Floating Add Meal Button */}
        {selectedDayMeals && (
          <TouchableOpacity
            style={styles.floatingAddButton}
            onPress={() => setShowAddMealModal(true)}>
            <Text style={styles.floatingAddButtonText}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      <AddMeal
        visible={showAddMealModal}
        onClose={() => {
          setShowAddMealModal(false);
          loadMealData(true); // Refresh meal data while preserving selected date
        }}
        selectedDate={selectedDate}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottom}>
        <View style={styles.navbar}>
          <TouchableOpacity
            style={styles.defaultnavbtn}
            onPress={() => navigation.navigate('HomeScreen')}>
            <Text style={{fontSize: 24, color: '#A5A5A5'}}>🏠</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectedbtn}>
            <Text style={{fontSize: 20, color: '#FFFFFF'}}>📅</Text>
            <Text style={styles.selectedNavText}>Calendar</Text>
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
  contentWrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  calendarContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  calendar: {
    borderRadius: 10,
  },
  mealHistoryContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 100,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  nutritionSummary: {
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#23233C',
    marginBottom: 10,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6CC57C',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#A5A5A5',
  },
  mealsSection: {
    marginBottom: 20,
  },
  mealsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#23233C',
    marginBottom: 10,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  mealInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#23233C',
    flex: 1,
  },
  mealCalories: {
    fontSize: 14,
    color: '#6CC57C',
    fontWeight: '600',
  },
  mealMacros: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  mealNutrition: {
    alignItems: 'flex-end',
  },
  deleteMealButton: {
    padding: 8,
    marginLeft: 10,
  },
  deleteMealButtonText: {
    fontSize: 18,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  floatingAddButton: {
    backgroundColor: '#6CC57C',
    width: 40,
    height: 80,
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: '40%',
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingLeft: 5,
  },
  floatingAddButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  singleline: {
    height: 1,
    backgroundColor: '#d9e1e8',
    marginVertical: 10,
  },
  emptyMealsState: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyMealsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#23233C',
    marginBottom: 10,
  },
  emptyMealsSubtext: {
    fontSize: 12,
    color: '#A5A5A5',
    fontStyle: 'italic',
  },
  mealsScroll: {
    maxHeight: 200,
  },
  bottom: {
    backgroundColor: 'white',
    width: screenWidth,
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
  selectedbtn: {
    flexDirection: 'row',
    width: 101,
    height: 33,
    backgroundColor: '#6CC57C',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedNavText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 5,
  },
  defaultnavbtn: {
    padding: 8,
    alignItems: 'center',
  },
  navText: {
    fontSize: 10,
    color: '#A5A5A5',
    marginTop: 2,
  },
});

export default Calendar;
