import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  Image,
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import MealManager from './MealManager';
import {useFocusEffect} from '@react-navigation/native';
import AddMeal from './AddMeal';

const screenWidth = Dimensions.get('window').width;

// Food database with nutrition information
const FOOD_DATABASE = [
  {
    id: 1,
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
  },
  {id: 2, name: 'Brown Rice', calories: 216, protein: 4.5, carbs: 45, fat: 1.8},
  {id: 3, name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6},
  {id: 4, name: 'Salmon', calories: 208, protein: 22, carbs: 0, fat: 13},
  {
    id: 5,
    name: 'Sweet Potato',
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
  },
  {
    id: 6,
    name: 'Greek Yogurt',
    calories: 100,
    protein: 10,
    carbs: 3.6,
    fat: 0.7,
  },
  {id: 7, name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 2.5},
  {id: 8, name: 'Eggs', calories: 70, protein: 6, carbs: 0.6, fat: 5},
  {id: 9, name: 'Avocado', calories: 160, protein: 2, carbs: 8.5, fat: 14.7},
  {id: 10, name: 'Almonds', calories: 164, protein: 6, carbs: 6.1, fat: 14.2},
];

const App = ({navigation, route}) => {
  const [currentDate, getCurrentDate] = useState('');
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [personalInfo, setPersonalInfo] = useState({
    height: '',
    weight: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate',
  });
  const [nutritionValues, setNutritionValues] = useState({
    calories: {current: 0, goal: 2500},
    protein: {current: 0, goal: 100},
    carbs: {current: 0, goal: 200},
    fat: {current: 0, goal: 80},
  });
  const [todaysMeals, setTodaysMeals] = useState([]);
  const [showAddMealModal, setShowAddMealModal] = useState(false);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const scrollViewRef = useRef();

  useEffect(() => {
    var date = new Date();
    var day = date.getDate();
    let longMonth = monthNames[date.getMonth()];
    var year = date.getFullYear();
    getCurrentDate('Today, ' + day + ' ' + longMonth + ' ' + year);
  });

  useEffect(() => {
    if (route.params?.updatedPersonalInfo) {
      const newPersonalInfo = route.params.updatedPersonalInfo;
      setPersonalInfo(newPersonalInfo);
      updateNutritionGoals(newPersonalInfo);
    }
  }, [route.params?.updatedPersonalInfo]);

  const addFood = food => {
    setSelectedFoods(prev => [...prev, food]);
    updateNutritionValues(food, 'add');
  };

  const removeFood = food => {
    setSelectedFoods(prev => prev.filter(f => f.id !== food.id));
    updateNutritionValues(food, 'remove');
  };

  const updateNutritionValues = (food, action) => {
    const multiplier = action === 'add' ? 1 : -1;
    setNutritionValues(prev => ({
      calories: {
        ...prev.calories,
        current: Math.max(
          0,
          prev.calories.current + food.calories * multiplier,
        ),
      },
      protein: {
        ...prev.protein,
        current: Math.max(0, prev.protein.current + food.protein * multiplier),
      },
      carbs: {
        ...prev.carbs,
        current: Math.max(0, prev.carbs.current + food.carbs * multiplier),
      },
      fat: {
        ...prev.fat,
        current: Math.max(0, prev.fat.current + food.fat * multiplier),
      },
    }));
  };

  const calculateBMI = () => {
    if (personalInfo.height && personalInfo.weight) {
      const heightInMeters = personalInfo.height / 100;
      return (personalInfo.weight / (heightInMeters * heightInMeters)).toFixed(
        1,
      );
    }
    return '0';
  };

  const calculateDailyCalories = info => {
    if (!info.height || !info.weight || !info.age) {
      return 2500;
    }

    // Harris-Benedict Equation
    let bmr;
    if (info.gender === 'male') {
      bmr =
        88.362 + 13.397 * info.weight + 4.799 * info.height - 5.677 * info.age;
    } else {
      bmr =
        447.593 + 9.247 * info.weight + 3.098 * info.height - 4.33 * info.age;
    }

    // Activity level multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    return Math.round(bmr * activityMultipliers[info.activityLevel]);
  };

  const handleSaveSettings = newPersonalInfo => {
    setPersonalInfo(newPersonalInfo);
    updateNutritionGoals(newPersonalInfo);
  };

  const updateNutritionGoals = info => {
    const dailyCalories = calculateDailyCalories(info);
    setNutritionValues(prev => ({
      ...prev,
      calories: {
        ...prev.calories,
        goal: dailyCalories,
      },
      protein: {
        ...prev.protein,
        goal: Math.round((dailyCalories * 0.3) / 4), // 30% of calories from protein
      },
      carbs: {
        ...prev.carbs,
        goal: Math.round((dailyCalories * 0.4) / 4), // 40% of calories from carbs
      },
      fat: {
        ...prev.fat,
        goal: Math.round((dailyCalories * 0.3) / 9), // 30% of calories from fat
      },
    }));
  };

  const ProgressBar = ({current, goal, color}) => {
    const progress = Math.min((current / goal) * 100, 100);
    return (
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {width: `${progress}%`, backgroundColor: color},
          ]}
        />
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>
    );
  };

  const NutritionItem = ({label, current, goal, color}) => (
    <View style={styles.nutritionItem}>
      <View style={styles.nutritionHeader}>
        <Text style={styles.nutritionLabel}>{label}</Text>
        <Text style={[styles.nutritionValue, {color}]}>
          {Math.round(current)}/{goal}
        </Text>
      </View>
      <ProgressBar current={current} goal={goal} color={color} />
    </View>
  );

  const FoodItem = ({food}) => {
    const isSelected = selectedFoods.some(f => f.id === food.id);
    return (
      <View style={styles.foodItem}>
        <Text style={styles.foodName}>{food.name}</Text>
        <TouchableOpacity
          style={[styles.foodButton, isSelected && styles.selectedFoodButton]}
          onPress={() => (isSelected ? removeFood(food) : addFood(food))}>
          <Text
            style={[
              styles.foodButtonText,
              isSelected && styles.selectedFoodButtonText,
            ]}>
            {isSelected ? 'Remove' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Load today's meals from MealManager
  const loadTodaysMeals = async () => {
    try {
      await MealManager.loadMealHistory();
      const today = new Date();
      const meals = MealManager.getTodaysMeals(today);
      setTodaysMeals(meals);
      
      // Calculate nutrition values from meals only
      const mealNutrition = meals.reduce(
        (acc, meal) => ({
          calories: acc.calories + (meal.calory || 0),
          protein: acc.protein + (meal.protein || 0),
          carbs: acc.carbs + (meal.carbs || 0),
          fat: acc.fat + (meal.fats || 0),
        }),
        {calories: 0, protein: 0, carbs: 0, fat: 0}
      );
      
      // Calculate nutrition from selected foods
      const foodNutrition = selectedFoods.reduce(
        (acc, food) => ({
          calories: acc.calories + (food.calories || 0),
          protein: acc.protein + (food.protein || 0),
          carbs: acc.carbs + (food.carbs || 0),
          fat: acc.fat + (food.fat || 0),
        }),
        {calories: 0, protein: 0, carbs: 0, fat: 0}
      );
      
      setNutritionValues(prev => ({
        calories: {
          ...prev.calories,
          current: mealNutrition.calories + foodNutrition.calories,
        },
        protein: {
          ...prev.protein,
          current: mealNutrition.protein + foodNutrition.protein,
        },
        carbs: {
          ...prev.carbs,
          current: mealNutrition.carbs + foodNutrition.carbs,
        },
        fat: {
          ...prev.fat,
          current: mealNutrition.fat + foodNutrition.fat,
        },
      }));
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  };

  // Reload meals when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadTodaysMeals();
    }, [])
  );

  // Reload when selectedFoods changes
  useEffect(() => {
    loadTodaysMeals();
  }, [selectedFoods]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerview}>
        <View style={styles.view1}>
          <Text style={styles.activity}>HealthyHams</Text>
        </View>
        <View style={styles.view2}>
          <Text style={styles.datetext}>{currentDate}</Text>
        </View>
      </View>
      <View style={styles.contentWrapper}>
        <View style={styles.contentContainer}>
          <View style={styles.card1}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardheading}>Nutritions</Text>
            </View>
            <View style={styles.details}>
              <NutritionItem
                label="Calories"
                current={nutritionValues.calories.current}
                goal={nutritionValues.calories.goal}
                color="#6CC57C"
              />
            </View>
            <View style={styles.nutritionsSection}>
              <NutritionItem
                label="Protein"
                current={nutritionValues.protein.current}
                goal={nutritionValues.protein.goal}
                color="#6CC57C"
              />
              <NutritionItem
                label="Carbs"
                current={nutritionValues.carbs.current}
                goal={nutritionValues.carbs.goal}
                color="#6CC57C"
              />
              <NutritionItem
                label="Fat"
                current={nutritionValues.fat.current}
                goal={nutritionValues.fat.goal}
                color="#6CC57C"
              />
            </View>
          </View>
          <View style={styles.card2}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardheading}>Meals</Text>
            </View>
            <View style={styles.singleline} />
            
            {todaysMeals.length === 0 ? (
              <View style={styles.emptyMealsState}>
                <Text style={styles.emptyMealsText}>No meals added today</Text>
                <Text style={styles.emptyMealsSubtext}>
                  Tap the + button to search and add meals
                </Text>
              </View>
            ) : (
              <ScrollView style={styles.mealsScroll} showsVerticalScrollIndicator={false}>
                {todaysMeals.map((meal, index) => (
                  <View key={`meal-${index}`} style={styles.mealItem}>
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
                        const today = new Date();
                        MealManager.removeMealFromHistory(today, meal);
                        loadTodaysMeals();
                      }}>
                      <Text style={styles.deleteMealButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
        
        {/* Floating Add Meal Button */}
        <TouchableOpacity
          style={styles.floatingAddButton}
          onPress={() => setShowAddMealModal(true)}>
          <Text style={styles.floatingAddButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <AddMeal
        visible={showAddMealModal}
        onClose={() => {
          setShowAddMealModal(false);
          loadTodaysMeals(); // Refresh meals when modal closes
        }}
      />
      <View style={styles.bottom}>
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.selectedbtn}>
            <Image
              style={{width: 25, height: 25}}
              source={require('../assets/icons/home_50px.png')}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: 'bold',
                color: 'white',
                marginLeft: 10,
              }}>
              Home
            </Text>
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
            onPress={() =>
              navigation.navigate('PersonalSettings', {personalInfo})
            }>
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

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FA',
  },
  contentWrapper: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  view1: {
    flex: 1,
  },
  activity: {
    fontSize: 28,
    color: '#6CC57C',
    fontWeight: 'bold',
  },
  view2: {
    alignItems: 'flex-end',
  },
  datetext: {
    fontSize: 14,
    color: '#23233C',
  },
  card1: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  card2: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardheading: {
    fontSize: 20,
    color: '#23233C',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  details: {
    marginBottom: 20,
  },
  nutritionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  singleline: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 15,
  },
  FoodScroll: {
    flex: 1,
  },
  progressBarContainer: {
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 5,
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    right: 8,
    top: 2,
    color: '#23233C',
    fontSize: 12,
    fontWeight: 'bold',
  },
  nutritionItem: {
    marginBottom: 15,
  },
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  nutritionLabel: {
    fontSize: 16,
    color: '#23233C',
    fontWeight: 'bold',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nutritionValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#23233C',
    fontWeight: 'bold',
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  foodName: {
    fontSize: 16,
    color: '#23233C',
  },
  foodButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
  },
  selectedFoodButton: {
    backgroundColor: '#6CC57C',
  },
  foodButtonText: {
    color: '#23233C',
    fontSize: 14,
  },
  selectedFoodButtonText: {
    color: 'white',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingsButton: {
    fontSize: 24,
  },
  bottom: {
    backgroundColor: 'white',
    width: '100%',
    height: 65,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'center',
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
  defaultnavbtn: {
    padding: 8,
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
  emptyMealsState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMealsText: {
    fontSize: 18,
    color: '#23233C',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyMealsSubtext: {
    fontSize: 14,
    color: '#23233C',
  },
  mealsScroll: {
    flex: 1,
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
    color: '#23233C',
    fontWeight: 'bold',
    flex: 1,
  },
  mealNutrition: {
    alignItems: 'flex-end',
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
  deleteMealButton: {
    padding: 8,
    marginLeft: 10,
  },
  deleteMealButtonText: {
    fontSize: 18,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
});
