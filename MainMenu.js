import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const MainMenu = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Toilet games</Text>
      <View style={styles.buttonContainer}>
        <Button title="Snake Game" onPress={() => navigation.navigate('Snake')} />
        <View style={styles.buttonGap} />
        <Button title="Labyrinth Game" onPress={() => navigation.navigate('Labyrinth')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
    flexDirection: 'column',
  },
  buttonGap: {
    marginVertical: 10,
  },
});

export default MainMenu;