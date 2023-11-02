import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LabyrinthGame extends Component {
  state = {
    playerX: 0,
    playerY: 0,
    goalX: 9,
    goalY: 9,
    grid: [
      ['path', 'path', 'box', 'path', 'box', 'path', 'path', 'box', 'path', 'goal'],
      ['path', 'path', 'path', 'box', 'path', 'path', 'box', 'path', 'box', 'path'],
      ['box', 'box', 'path', 'box', 'box', 'box', 'box', 'box', 'box', 'box'],
      ['path', 'path', 'path', 'path', 'box', 'path', 'path', 'path', 'box', 'box'],
      ['box', 'box', 'box', 'path', 'path', 'path', 'box', 'path', 'path', 'path'],
      ['path', 'path', 'box', 'box', 'box', 'path', 'box', 'path', 'box', 'path'],
      ['box', 'path', 'box', 'path', 'box', 'path', 'box', 'path', 'box', 'path'],
      ['box', 'path', 'path', 'path', 'box', 'path', 'path', 'path', 'box', 'path'],
      ['path', 'path', 'box', 'box', 'box', 'box', 'box', 'path', 'path', 'path'],
      ['path', 'box', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path'],
    ],
    timer: 0,
    bestTime: null,
  };

  componentDidMount() {
    this.startTimer();
    this.loadBestTime();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer = () => {
    this.timerInterval = setInterval(() => {
      this.setState((prevState) => ({ timer: prevState.timer + 1 }));
    }, 1000);
  };

  stopTimer = () => {
    clearInterval(this.timerInterval);
  };

  movePlayer = (direction) => {
    const { playerX, playerY, grid } = this.state;

    const newX = playerX + (direction === 'LEFT' ? -1 : direction === 'RIGHT' ? 1 : 0);
    const newY = playerY + (direction === 'UP' ? -1 : direction === 'DOWN' ? 1 : 0);

    if (newX >= 0 && newX < grid[0].length && newY >= 0 && newY < grid.length && grid[newY][newX] !== 'box') {
      this.setState({ playerX: newX, playerY: newY });
    }

    if (newX === this.state.goalX && newY === this.state.goalY) {
      this.handleGameWin();
    }
  };

  handleGameWin = () => {
    this.stopTimer();
    const { timer, bestTime } = this.state;

    if (bestTime === null || timer < bestTime) {
      this.saveBestTime(timer);
    }

    alert('You won!');
  };

  saveBestTime = async (time) => {
    try {
      await AsyncStorage.setItem('bestTimeLabyrinth', time.toString());
      this.setState({ bestTime: time });
    } catch (error) {
      console.error('Error saving best time:', error);
    }
  };

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

  restartGame = () => {
    this.setState({
      playerX: 0,
      playerY: 0,
      timer: 0,
    });
    this.startTimer();
  };

  render() {
    const { timer, playerX, playerY, goalX, goalY, grid, bestTime } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Labyrinth Game</Text>
        <View style={styles.gameArea}>
          {grid.map((row, y) => (
            <View key={y} style={styles.row}>
              {row.map((cell, x) => (
                <View
                  key={x}
                  style={[
                    styles.cell,
                    cell === 'box' && styles.boxCell,
                    x === goalX && y === goalY && styles.goalCell,
                    x === playerX && y === playerY && styles.playerCell,
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
        <View style={styles.directionButtons}>
          <Button title="Up" onPress={() => this.movePlayer('UP')} />
          <View style={styles.horizontalControls}>
            <Button title="Left" onPress={() => this.movePlayer('LEFT')} />
            <Button title="Right" onPress={() => this.movePlayer('RIGHT')} />
          </View>
          <Button title="Down" onPress={() => this.movePlayer('DOWN')} />
        </View>
        <View style={styles.timerContainer}>
          <Text>Time: {timer} seconds</Text>
        </View>
        <Text>Best Time: {bestTime !== null ? bestTime + ' seconds' : 'N/A'}</Text>
        <Button title="Restart" onPress={this.restartGame} />
        <View style={{ height: 10 }} />
        <Button title="Main screen" onPress={() => this.props.navigation.navigate('Main')} />
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
    marginBottom: 20,
  },
  gameArea: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 30,
    height: 30,
    backgroundColor: 'lightgray',
    borderWidth: 1,
    borderColor: 'white',
  },
  boxCell: {
    backgroundColor: 'black',
  },
  goalCell: {
    backgroundColor: 'green',
  },
  playerCell: {
    backgroundColor: 'blue',
  },
  directionButtons: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  horizontalControls: {
    flexDirection: 'row',
  },
  timerContainer: {
    marginTop: 20,
  },
  button: {
    marginVertical: 10, 
  },
});

export default LabyrinthGame;