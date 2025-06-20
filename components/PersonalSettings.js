import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';

const PersonalSettings = ({route, navigation}) => {
  // Provide default values in case route.params or personalInfo is undefined
  const defaultPersonalInfo = {
    height: '',
    weight: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate'
  };
  
  const {personalInfo: initialPersonalInfo = defaultPersonalInfo} = route.params || {};
  const [personalInfo, setPersonalInfo] = useState(initialPersonalInfo);
  const [sliderValue, setSliderValue] = useState(2); // Default to moderate (index 2)
  const [hasChanges, setHasChanges] = useState(false);

  const activityLevels = [
    'sedentary',
    'light',
    'moderate',
    'active',
    'veryActive',
  ];
  const activityLabels = [
    'Sedentary',
    'Light',
    'Moderate',
    'Active',
    'Very Active',
  ];

  useEffect(() => {
    // Set initial slider value based on activity level
    const initialIndex = activityLevels.indexOf(personalInfo?.activityLevel || 'moderate');
    if (initialIndex !== -1) {
      setSliderValue(initialIndex);
    } else {
      // Fallback to moderate (index 2) if activity level is not found
      setSliderValue(2);
    }
  }, [personalInfo?.activityLevel]);

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSliderChange = value => {
    setSliderValue(value);
    handlePersonalInfoChange('activityLevel', activityLevels[value]);
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

  const getBMICategory = bmi => {
    if (bmi < 18.5) {
      return {category: 'Underweight', color: '#3498db'};
    }
    if (bmi < 25) {
      return {category: 'Normal', color: '#6CC57C'};
    }
    if (bmi < 30) {
      return {category: 'Overweight', color: '#f39c12'};
    }
    return {category: 'Obese', color: '#e74c3c'};
  };

  const calculateDailyCalories = () => {
    if (!personalInfo.height || !personalInfo.weight || !personalInfo.age) {
      return 2500;
    }

    // Harris-Benedict Equation
    let bmr;
    if (personalInfo.gender === 'male') {
      bmr =
        88.362 +
        13.397 * personalInfo.weight +
        4.799 * personalInfo.height -
        5.677 * personalInfo.age;
    } else {
      bmr =
        447.593 +
        9.247 * personalInfo.weight +
        3.098 * personalInfo.height -
        4.33 * personalInfo.age;
    }

    // Activity level multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    return Math.round(bmr * activityMultipliers[personalInfo.activityLevel]);
  };

  const handleSave = () => {
    // Validate required fields
    if (!personalInfo.height || !personalInfo.weight || !personalInfo.age) {
      Alert.alert(
        'Missing Information',
        'Please fill in all required fields (height, weight, age).',
      );
      return;
    }

    // Navigate directly back to HomeScreen with updated info
    navigation.navigate('HomeScreen', {
      updatedPersonalInfo: personalInfo,
    });
  };

  const bmi = calculateBMI();
  const bmiInfo = getBMICategory(parseFloat(bmi));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {personalInfo.gender === 'male' ? '👨' : '👩'}
                </Text>
              </View>
            </View>
            <Text style={styles.profileTitle}>Personal Profile</Text>
            <Text style={styles.profileSubtitle}>
              Manage your health information
            </Text>
          </View>

          {/* Basic Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Height (cm) *</Text>
              <TextInput
                style={styles.input}
                value={String(personalInfo.height || '')}
                onChangeText={value =>
                  handlePersonalInfoChange('height', value)
                }
                keyboardType="numeric"
                placeholder="Enter your height"
                placeholderTextColor="#A5A5A5"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight (kg) *</Text>
              <TextInput
                style={styles.input}
                value={String(personalInfo.weight || '')}
                onChangeText={value =>
                  handlePersonalInfoChange('weight', value)
                }
                keyboardType="numeric"
                placeholder="Enter your weight"
                placeholderTextColor="#A5A5A5"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Age *</Text>
              <TextInput
                style={styles.input}
                value={String(personalInfo.age || '')}
                onChangeText={value => handlePersonalInfoChange('age', value)}
                keyboardType="numeric"
                placeholder="Enter your age"
                placeholderTextColor="#A5A5A5"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.genderButtons}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    personalInfo.gender === 'male' && styles.selectedGender,
                  ]}
                  onPress={() => handlePersonalInfoChange('gender', 'male')}>
                  <Text
                    style={[
                      styles.genderButtonText,
                      personalInfo.gender === 'male' &&
                        styles.selectedGenderText,
                    ]}>
                    👨 Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    personalInfo.gender === 'female' && styles.selectedGender,
                  ]}
                  onPress={() => handlePersonalInfoChange('gender', 'female')}>
                  <Text
                    style={[
                      styles.genderButtonText,
                      personalInfo.gender === 'female' &&
                        styles.selectedGenderText,
                    ]}>
                    👩 Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Activity Level Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity Level</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={4}
                step={1}
                value={sliderValue}
                onValueChange={handleSliderChange}
                minimumTrackTintColor="#6CC57C"
                maximumTrackTintColor="#E0E0E0"
                thumbTintColor="#6CC57C"
              />
              <View style={styles.sliderLabelContainer}>
                <Text style={styles.sliderLabel}>
                  {activityLabels[sliderValue]}
                </Text>
                <Text style={styles.sliderDescription}>
                  {sliderValue === 0 && 'Little to no exercise'}
                  {sliderValue === 1 && 'Light exercise 1-3 days/week'}
                  {sliderValue === 2 && 'Moderate exercise 3-5 days/week'}
                  {sliderValue === 3 && 'Heavy exercise 6-7 days/week'}
                  {sliderValue === 4 && 'Very heavy exercise, physical job'}
                </Text>
              </View>
            </View>
          </View>

          {/* Health Stats Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Statistics</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{bmi}</Text>
                <Text style={styles.statLabel}>BMI</Text>
                <Text style={[styles.statCategory, {color: bmiInfo.color}]}>
                  {bmiInfo.category}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{calculateDailyCalories()}</Text>
                <Text style={styles.statLabel}>Daily Calories</Text>
                <Text style={styles.statCategory}>Recommended</Text>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, hasChanges && styles.saveButtonActive]}
            onPress={handleSave}>
            <Text style={styles.saveButtonText}>💾 Save Profile</Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacing} />
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
          <TouchableOpacity style={styles.selectedbtn}>
            <Image
              style={{width: 20, height: 20, tintColor: '#FFFFFF'}}
              source={require('../assets/icons/profile_50px.png')}
            />
            <Text style={styles.selectedNavText}>Settings</Text>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6CC57C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatarText: {
    fontSize: 40,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#23233C',
    marginBottom: 5,
  },
  profileSubtitle: {
    fontSize: 16,
    color: '#A5A5A5',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#23233C',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#23233C',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    color: '#23233C',
  },
  genderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  genderButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedGender: {
    backgroundColor: '#6CC57C',
    borderColor: '#6CC57C',
  },
  genderButtonText: {
    textAlign: 'center',
    color: '#23233C',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedGenderText: {
    color: 'white',
  },
  sliderContainer: {
    marginTop: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabelContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  sliderLabel: {
    textAlign: 'center',
    color: '#23233C',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sliderDescription: {
    textAlign: 'center',
    color: '#A5A5A5',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#23233C',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#A5A5A5',
    marginBottom: 5,
  },
  statCategory: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
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
  saveButtonActive: {
    backgroundColor: '#6CC57C',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  bottomSpacing: {
    height: 80,
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
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 5,
  },
  defaultnavbtn: {
    padding: 8,
  },
});

export default PersonalSettings;
