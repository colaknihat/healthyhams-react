import axios from 'axios';

class EdamamApiHelper {
  static APP_ID = '895769bc';
  static APP_KEY = '70d86f3b74e95e3cf57ee395b375a386';
  static BASE_URL = 'https://api.edamam.com/api/nutrition-data';

  static async fetchFoodNutrition(foodName) {
    const url = `${this.BASE_URL}?app_id=${this.APP_ID}&app_key=${this.APP_KEY}&ingr=${encodeURIComponent(foodName)}`;
    
    try {
      console.log('API URL:', url);
      const response = await axios.get(url);
      
      if (response.status === 200) {
        return response.data;
      } else {
        console.log(`Request failed with status: ${response.status}`);
        return null;
      }
    } catch (error) {
      console.log('Error fetching nutrition data:', error);
      return null;
    }
  }
}

export default EdamamApiHelper; 