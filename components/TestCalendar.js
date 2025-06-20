import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

const TestCalendar = ({navigation, route}) => {
  console.log('TestCalendar component loaded successfully!');
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Test Calendar Screen</Text>
        <Text style={styles.subtitle}>This is a simple test calendar component</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#23233C',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#A5A5A5',
    textAlign: 'center',
  },
});

export default TestCalendar; 