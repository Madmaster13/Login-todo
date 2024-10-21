import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Dummy API URL
const API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=5';

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [error, setError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from API on app startup
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      const tasksWithDate = response.data.map(task => ({
        ...task,
        createdAt: new Date().toISOString(),
      }));
      setTasks(tasksWithDate);
      await AsyncStorage.setItem('tasks', JSON.stringify(tasksWithDate));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) {
      setError('Task cannot be empty');
      return;
    }
    setError('');

    const task = {
      id: Math.random().toString(),
      title: newTask,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: dueDate.toISOString(),
    };

    const updatedTasks = [task, ...tasks];
    setTasks(updatedTasks);
    setNewTask('');
    setShowDatePicker(false);

    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const deleteTask = async (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const markCompleted = async (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const renderTask = ({ item }) => (
    <View style={[styles.task, { backgroundColor: item.completed ? '#d1e7dd' : '#fff' }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.taskText, item.completed && styles.completedTask]}>{item.title}</Text>
        <Text style={styles.dateText}>
          Due: {new Date(item.dueDate).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => markCompleted(item.id)}>
          <Ionicons
            name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color="#4CAF50"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTask(item.id)}>
          <Ionicons name="trash-bin" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Details', { task: item, onToggle: markCompleted })}>
          <Ionicons name="eye" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task"
          value={newTask}
          onChangeText={setNewTask}
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateIcon}>
          <Ionicons name="calendar" size={24} color="#757575" />
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || dueDate;
            setShowDatePicker(false);
            setDueDate(currentDate);
          }}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={tasks.length === 0 ? styles.emptyList : null}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchTasks} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#f3f4f6', // Light gray background
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1E88E5', // Blue color for title
  },
  error: {
    color: '#d9534f', // Red color for error messages
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden', // To round the borders of the input container
    backgroundColor: '#fff', // White background for input container
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    marginRight: 10,
    borderRadius: 5,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  dateIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  task: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 1, // Add shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    backgroundColor: '#fff', // White background for tasks
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  completedTask: {
    textDecorationLine: 'line-through', // Strikethrough for completed tasks
    color: '#999', // Gray color for completed tasks
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  emptyList: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#1E88E5', // Blue background for Add Task button
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#ffffff', // White text for the button
    fontSize: 18,
    fontWeight: 'bold',
  },
});
