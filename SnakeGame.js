import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage from @react-native-async-storage/async-storage

class SnakeGame extends Component {
  state = {
    snake: [{ x: 1, y: 1 }],
    food: { x: 5, y: 5 },
    direction: 'RIGHT',
    gameInterval: null,
    score: 0,
    bestScore: 0, // Initialize the best score
  };

  componentDidMount() {
    this.startGame();
    this.loadBestScore();
  }

  componentWillUnmount() {
    clearInterval(this.state.gameInterval);
  }

  async loadBestScore() {
    try {
      const bestScore = await AsyncStorage.getItem('bestScore');
      if (bestScore) {
        this.setState({ bestScore: parseInt(bestScore, 10) });
      }
    } catch (error) {
      console.error('Error loading best score:', error);
    }
  }

  async saveBestScore(score) {
    try {
      await AsyncStorage.setItem('bestScore', score.toString());
    } catch (error) {
      console.error('Error saving best score:', error);
    }
  }

  startGame = () => {
    if (this.state.gameInterval) {
      clearInterval(this.state.gameInterval);
    }
    const gameInterval = setInterval(this.moveSnake, 200);
    this.setState({ gameInterval });
  };

  /*restartGame = () => {
    clearInterval(this.state.gameInterval);
    this.setState({
      snake: [{ x: 1, y: 1 }],
      food: this.generateFood(),
      direction: 'RIGHT',
      score: 0,
    }, () => {
      this.startGame();
    });
  };*/

  moveSnake = () => {
    const { snake, direction, food } = this.state;
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'UP':
        head.y--;
        break;
      case 'DOWN':
        head.y++;
        break;
      case 'LEFT':
        head.x--;
        break;
      case 'RIGHT':
        head.x++;
        break;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      this.generateFood();
      this.setState((prevState) => {
        const newScore = prevState.score + 1;
        if (newScore > prevState.bestScore) {
          this.saveBestScore(newScore); // Save the best score
          return { score: newScore, bestScore: newScore };
        }
        return { score: newScore };
      });
    } else {
      newSnake.pop();
    }

    this.setState({ snake: newSnake });

    if (this.checkCollision()) {
      clearInterval(this.state.gameInterval);
      alert(`Game Over. Your Score: ${this.state.score}`);
    }
  };


  checkCollision = () => {
    const { snake } = this.state;
    const head = snake[0];

    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= 10 ||
      head.y >= 10 ||
      snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      return true;
    }

    return false;
  };

  generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
    };

    this.setState({ food: newFood });
  };

  changeDirection = (newDirection) => {
    const { direction } = this.state;
  
    if (
      (direction === 'LEFT' && newDirection === 'RIGHT') ||
      (direction === 'RIGHT' && newDirection === 'LEFT') ||
      (direction === 'UP' && newDirection === 'DOWN') ||
      (direction === 'DOWN' && newDirection === 'UP')
    ) {
      return;
    }
  
    this.setState({ direction: newDirection });
  };

  render() {
    const { snake, food, score, bestScore } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Snake Game</Text>
        <View style={styles.scoreDisplay}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.bestScoreText}>High Score: {bestScore}</Text>
        </View>
        <View style={styles.gameArea}>
          {Array.from({ length: 10 }).map((_, y) => (
            <View key={y} style={styles.row}>
              {Array.from({ length: 10 }).map((_, x) => (
                <View
                  key={x}
                  style={[
                    styles.cell,
                    snake.some((segment) => segment.x === x && segment.y === y) && styles.snakeSegment,
                    food.x === x && food.y === y && styles.food,
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
        <View style={styles.directionButtons}>
          <View style={styles.horizontalControls}>
            <Button title="Left" onPress={() => this.changeDirection('LEFT')} />
            <Button title="Right" onPress={() => this.changeDirection('RIGHT')} />
          </View>
          <Button title="Up" onPress={() => this.changeDirection('UP')} />
          <Button title="Down" onPress={() => this.changeDirection('DOWN')} />
        </View>
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
    marginBottom: 10,
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
  snakeSegment: {
    backgroundColor: 'green',
  },
  food: {
    backgroundColor: 'red',
  },
  directionButtons: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  horizontalControls: {
    flexDirection: 'row',
  },
  scoreDisplay: {
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 16,
  },
  bestScoreText: {
    fontSize: 16,
  },
});

export default SnakeGame;