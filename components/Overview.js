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
} from 'react-native';

const {width: screenWidth} = Dimensions.get('window');

const Overview = ({navigation, route}) => {
  const [monthlyStats, setMonthlyStats] = useState({});
  const [weeklyProgress, setWeeklyProgress] = useState([]);

  // Sample data - in a real app, this would come from your data storage
  const sampleMonthlyStats = {
    daysTracked: 3,
    avgCalories: 1957,
    avgProtein: 135,
    avgCarbs: 180,
    avgFat: 73,
    totalMeals: 9,
    goalAchieved: 2,
    streakDays: 3,
  };

  const sampleWeeklyProgress = [
    {day: 'Mon', calories: 1850, goal: 2000, achieved: false},
    {day: 'Tue', calories: 1920, goal: 2000, achieved: false},
    {day: 'Wed', calories: 2100, goal: 2000, achieved: true},
    {day: 'Thu', calories: 0, goal: 2000, achieved: false},
    {day: 'Fri', calories: 0, goal: 2000, achieved: false},
    {day: 'Sat', calories: 0, goal: 2000, achieved: false},
    {day: 'Sun', calories: 0, goal: 2000, achieved: false},
  ];

  useEffect(() => {
    setMonthlyStats(sampleMonthlyStats);
    setWeeklyProgress(sampleWeeklyProgress);
  }, []);

  const ProgressBar = ({current, goal, color}) => {
    const percentage = Math.min((current / goal) * 100, 100);
    return (
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {width: `${percentage}%`, backgroundColor: color},
          ]}
        />
        <Text style={styles.progressText}>{Math.round(percentage)}%</Text>
      </View>
    );
  };

  const WeeklyChart = () => (
    <View style={styles.weeklyChart}>
      <Text style={styles.chartTitle}>This Week's Progress</Text>
      <View style={styles.chartContainer}>
        {weeklyProgress.map((day, index) => (
          <View key={index} style={styles.dayColumn}>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: Math.max((day.calories / day.goal) * 100, 5),
                    backgroundColor: day.achieved ? '#6CC57C' : '#E0E0E0',
                  },
                ]}
              />
            </View>
            <Text style={styles.dayLabel}>{day.day}</Text>
            <Text style={styles.calorieLabel}>{day.calories}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.chartSubtitle}>Daily Calorie Intake</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Monthly Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>This Month's Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{monthlyStats.daysTracked}</Text>
              <Text style={styles.statLabel}>Days Tracked</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{monthlyStats.avgCalories}</Text>
              <Text style={styles.statLabel}>Avg Calories</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{monthlyStats.avgProtein}g</Text>
              <Text style={styles.statLabel}>Avg Protein</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{monthlyStats.avgCarbs}g</Text>
              <Text style={styles.statLabel}>Avg Carbs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{monthlyStats.avgFat}g</Text>
              <Text style={styles.statLabel}>Avg Fat</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{monthlyStats.totalMeals}</Text>
              <Text style={styles.statLabel}>Total Meals</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{monthlyStats.goalAchieved}</Text>
              <Text style={styles.statLabel}>Goals Achieved</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{monthlyStats.streakDays}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>
          </View>
        </View>

        {/* Weekly Progress Chart */}
        <View style={styles.chartCard}>
          <WeeklyChart />
        </View>

        {/* Achievement Section */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.achievementsTitle}>Recent Achievements</Text>
          <View style={styles.achievementItem}>
            <Text style={styles.achievementIcon}>🎯</Text>
            <View style={styles.achievementText}>
              <Text style={styles.achievementTitle}>Goal Achieved!</Text>
              <Text style={styles.achievementDesc}>Met your calorie goal for 2 days</Text>
            </View>
          </View>
          <View style={styles.achievementItem}>
            <Text style={styles.achievementIcon}>🔥</Text>
            <View style={styles.achievementText}>
              <Text style={styles.achievementTitle}>3-Day Streak!</Text>
              <Text style={styles.achievementDesc}>Keep tracking your meals</Text>
            </View>
          </View>
          <View style={styles.achievementItem}>
            <Text style={styles.achievementIcon}>💪</Text>
            <View style={styles.achievementText}>
              <Text style={styles.achievementTitle}>Protein Champion</Text>
              <Text style={styles.achievementDesc}>Excellent protein intake this week</Text>
            </View>
          </View>
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
          <TouchableOpacity style={styles.selectedbtn}>
            <Image
              style={{width: 20, height: 20, tintColor: '#FFFFFF'}}
              source={require('../assets/icons/ribbon_50px.png')}
            />
            <Text style={styles.selectedNavText}>Overview</Text>
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
  content: {
    flex: 1,
  },
  statsContainer: {
    backgroundColor: 'white',
    margin: 20,
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
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#23233C',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6CC57C',
  },
  statLabel: {
    fontSize: 12,
    color: '#A5A5A5',
    textAlign: 'center',
  },
  chartCard: {
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
    shadowRadius: 3,
    elevation: 3,
  },
  weeklyChart: {
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#23233C',
    marginBottom: 15,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    width: '100%',
    marginBottom: 10,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 100,
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    minHeight: 5,
  },
  dayLabel: {
    fontSize: 12,
    color: '#23233C',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  calorieLabel: {
    fontSize: 10,
    color: '#A5A5A5',
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#A5A5A5',
    fontStyle: 'italic',
  },
  achievementsContainer: {
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
  achievementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#23233C',
    marginBottom: 15,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#F4F5FA',
    borderRadius: 10,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#23233C',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 12,
    color: '#A5A5A5',
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

export default Overview; 