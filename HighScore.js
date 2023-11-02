import React, { Component } from 'react';
import { View, Text, AsyncStorage, StyleSheet } from 'react-native';

class HighScore extends Component {
  state = {
    bestTime: 0,
  };

  componentDidMount() {
    this.loadBestTime();
  }

  loadBestTime = async () => {
    try {
      const bestTime = await AsyncStorage.getItem('bestTimeLabyrinth');
      if (bestTime !== null) {
        this.setState({ bestTime: parseInt(bestTime) });
      }
    } catch (error) {
      console.error('Error loading best time:', error);
    }
  };

  render() {
    const { bestTime } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.header}>High Scores</Text>
        <Text>Labyrinth game: {bestTime} seconds</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default HighScore;