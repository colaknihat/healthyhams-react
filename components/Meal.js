import React from 'react';
import {View, Text, TouchableOpacity, Alert, StyleSheet} from 'react-native';

export class Meal {
  constructor({name, protein, carbs, fats, calory}) {
    this.name = name;
    this.protein = protein;
    this.carbs = carbs;
    this.fats = fats;
    this.calory = calory;
  }

  static fromApiData(json) {
    // Extract nutrition information from the API response
    const protein = json.totalNutrients?.PROCNT?.quantity || 0;
    const truncatedProtein = Math.floor(protein);

    const carbs = json.totalNutrients?.CHOCDF?.quantity || 0;
    const truncatedCarbs = Math.floor(carbs);

    const fats = json.totalNutrients?.FAT?.quantity || 0;
    const truncatedFats = Math.floor(fats);

    const calories = json.totalNutrients?.ENERC_KCAL?.quantity || 0;
    const truncatedCalories = Math.floor(calories);

    return new Meal({
      name: json.ingredients?.[0]?.parsed?.[0]?.food || 'Unknown Food',
      protein: truncatedProtein,
      carbs: truncatedCarbs,
      fats: truncatedFats,
      calory: truncatedCalories,
    });
  }
}

export const MealCard = ({meal, onDelete}) => {
  const showDeleteConfirmationDialog = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this meal?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: onDelete,
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <View style={styles.mealCard}>
      <TouchableOpacity
        style={styles.mealContent}
        onLongPress={showDeleteConfirmationDialog}>
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{meal.name}</Text>
          <View style={styles.nutritionInfo}>
            <Text style={styles.caloriesText}>{meal.calory} calories</Text>
            <View style={styles.macrosRow}>
              <Text style={styles.macroText}>{meal.carbs} carbs </Text>
              <Text style={styles.macroText}>{meal.fats} fats </Text>
              <Text style={styles.macroText}>{meal.protein} proteins</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

// Sample meals for testing
export const sampleMeals = [
  new Meal({
    name: 'Steak',
    protein: 50,
    carbs: 10,
    fats: 25,
    calory: 750,
  }),
  new Meal({
    name: 'Bread',
    protein: 0,
    carbs: 100,
    fats: 10,
    calory: 200,
  }),
  new Meal({
    name: 'Cola',
    protein: 0,
    carbs: 100,
    fats: 0,
    calory: 150,
  }),
  new Meal({
    name: 'Salad',
    protein: 0,
    carbs: 10,
    fats: 10,
    calory: 50,
  }),
];

const styles = StyleSheet.create({
  mealCard: {
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mealContent: {
    padding: 15,
  },
  mealInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#23233C',
    flex: 1,
  },
  nutritionInfo: {
    alignItems: 'flex-end',
  },
  caloriesText: {
    fontSize: 14,
    color: '#6CC57C',
    fontWeight: '600',
  },
  macrosRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  macroText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
}); 