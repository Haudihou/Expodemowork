import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import MainMenu from './MainMenu';
import SnakeGame from './SnakeGame';
import LabyrinthGame from './LabyrinthGame';
import HighScore from './HighScore';

const AppNavigator = createStackNavigator(
  {
    Main: MainMenu,
    Snake: SnakeGame,
    Labyrinth: LabyrinthGame,
    Highscore: HighScore,
  },
  {
    initialRouteName: 'Main',
  }
);

const AppContainer = createAppContainer(AppNavigator);

const App = () => {
  return <AppContainer />;
};

export default App;