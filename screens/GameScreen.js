import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

const boardSize = 15; // Size of the board (15x15)
const playerCount = 4; // Number of players

const initialPositions = [
  { x: 0, y: 0 }, // Player 1
  { x: 0, y: 1 }, // Player 2
  { x: 0, y: 2 }, // Player 3
  { x: 0, y: 3 }, // Player 4
];

const LudoGame = () => {
  const [positions, setPositions] = useState(initialPositions);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState(0);

  const rollDice = () => {
    const newDiceValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(newDiceValue);
    movePlayer(newDiceValue);
  };

  const movePlayer = (dice) => {
    const newPositions = [...positions];
    newPositions[currentPlayer].x += dice; // Move player in the x-direction

    // Reset position if it exceeds board size
    if (newPositions[currentPlayer].x >= boardSize) {
      newPositions[currentPlayer].x = boardSize - 1; // Stop at the edge
      Alert.alert(`Player ${currentPlayer + 1} reached the end!`);
    }

    setPositions(newPositions);
    setCurrentPlayer((currentPlayer + 1) % playerCount); // Move to the next player
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ludo Game</Text>
      <View style={styles.board}>
        {Array.from({ length: boardSize }).map((_, rowIndex) =>
          <View key={rowIndex} style={styles.row}>
            {Array.from({ length: boardSize }).map((_, colIndex) => {
              const player = positions.findIndex(pos => pos.x === colIndex && pos.y === rowIndex);
              return (
                <View
                  key={colIndex}
                  style={[
                    styles.cell,
                    { backgroundColor: (rowIndex + colIndex) % 2 === 0 ? '#f0f0f0' : '#fff' }
                  ]}
                >
                  {player >= 0 && <View style={styles.playerPiece} />}
                </View>
              );
            })}
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.diceButton} onPress={rollDice}>
        <Text style={styles.buttonText}>Roll Dice</Text>
      </TouchableOpacity>
      <Text style={styles.diceText}>Dice: {diceValue}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
  },
  board: {
    borderWidth: 2,
    borderColor: '#333',
    height: 300,
    width: 300,
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerPiece: {
    width: 20,
    height: 20,
    backgroundColor: 'blue',
    borderRadius: 10,
  },
  diceButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  diceText: {
    marginTop: 10,
    fontSize: 18,
  },
});

export default LudoGame;
