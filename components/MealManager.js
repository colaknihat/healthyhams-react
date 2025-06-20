import AsyncStorage from '@react-native-async-storage/async-storage';

// Fallback storage for cases where AsyncStorage might not be available
const fallbackStorage = {
  setItem: async (key, value) => {
    console.log(`Storing ${key}:`, value);
    return Promise.resolve();
  },
  getItem: async (key) => {
    console.log(`Getting ${key}`);
    return Promise.resolve(null);
  },
  removeItem: async (key) => {
    console.log(`Removing ${key}`);
    return Promise.resolve();
  },
};

class MealManager {
  static mealHistory = new Map();

  static addToMealHistory(day, meal) {
    const dayKey = this.formatDateKey(day);
    
    if (!this.mealHistory.has(dayKey)) {
      this.mealHistory.set(dayKey, [meal]);
    } else {
      const existingMeals = this.mealHistory.get(dayKey);
      existingMeals.push(meal);
    }
    
    // Save to persistent storage
    this.saveMealHistory();
  }

  static removeMealFromHistory(day, meal) {
    const dayKey = this.formatDateKey(day);
    
    if (this.mealHistory.has(dayKey)) {
      const meals = this.mealHistory.get(dayKey);
      const updatedMeals = meals.filter(m => 
        !(m.name === meal.name && 
          m.protein === meal.protein && 
          m.carbs === meal.carbs && 
          m.fats === meal.fats && 
          m.calory === meal.calory)
      );
      
      if (updatedMeals.length === 0) {
        this.mealHistory.delete(dayKey);
      } else {
        this.mealHistory.set(dayKey, updatedMeals);
      }
      
      // Save to persistent storage
      this.saveMealHistory();
    }
  }

  static getTodaysMeals(todaysDate) {
    const dayKey = this.formatDateKey(todaysDate);
    return this.mealHistory.get(dayKey) || [];
  }

  static getAllMealHistory() {
    return this.mealHistory;
  }

  static formatDateKey(date) {
    // Format date as YYYY-MM-DD for consistent keys
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return date;
  }

  // Helper method to get the appropriate storage
  static getStorage() {
    try {
      // Test if AsyncStorage is available
      if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
        return AsyncStorage;
      }
    } catch (error) {
      console.warn('AsyncStorage not available, using fallback storage');
    }
    return fallbackStorage;
  }

  // Persistent storage methods
  static async saveMealHistory() {
    try {
      const storage = this.getStorage();
      const historyObject = Object.fromEntries(this.mealHistory);
      await storage.setItem('mealHistory', JSON.stringify(historyObject));
    } catch (error) {
      console.error('Error saving meal history:', error);
    }
  }

  static async loadMealHistory() {
    try {
      const storage = this.getStorage();
      const historyString = await storage.getItem('mealHistory');
      if (historyString) {
        const historyObject = JSON.parse(historyString);
        this.mealHistory = new Map(Object.entries(historyObject));
      }
    } catch (error) {
      console.error('Error loading meal history:', error);
    }
  }

  static async clearMealHistory() {
    try {
      const storage = this.getStorage();
      this.mealHistory.clear();
      await storage.removeItem('mealHistory');
    } catch (error) {
      console.error('Error clearing meal history:', error);
    }
  }
}

export default MealManager; 