import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Text, Button, Card, FAB, useTheme, Portal, Modal, TextInput, MD3Theme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format, isToday, parseISO } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

type Task = {
  id: string;
  title: string;
  description?: string;
  time: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
};

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Morning Routine',
    description: 'Exercise, shower, and breakfast',
    time: '08:00',
    completed: false,
    priority: 'medium',
  },
  {
    id: '2',
    title: 'Team Meeting',
    description: 'Weekly sync with the development team',
    time: '10:30',
    completed: false,
    priority: 'high',
  },
  {
    id: '3',
    title: 'Lunch Break',
    time: '13:00',
    completed: false,
    priority: 'low',
  },
];

interface DailyPlanScreenProps {
  styles: ReturnType<typeof makeStyles>;
}

const DailyPlanScreen = ({ styles }: DailyPlanScreenProps) => {
  const theme = useTheme();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({ 
    title: '', 
    description: '', 
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), // 24hr format
    completed: false, 
    priority: 'medium' 
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    const taskToAdd = {
      ...newTask,
      id: Date.now().toString(),
    };
    setTasks([...tasks, taskToAdd].sort((a, b) => a.time.localeCompare(b.time)));
    setNewTask({ 
      title: '', 
      description: '', 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), // 24hr format
      completed: false, 
      priority: 'medium' 
    });
    setShowAddModal(false);
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const timeString = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }); // 24hr format
      setNewTask({ ...newTask, time: timeString });
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.primary;
      case 'low':
        return theme.colors.secondary;
      default:
        return theme.colors.outlineVariant;
    }
  };

  // Helper function to get text color
  const getTextColor = () => {
    return theme.colors.onSurface;
  };

  // Helper function to get disabled text color
  const getDisabledTextColor = () => {
    return theme.colors.onSurfaceDisabled || theme.colors.onSurfaceVariant;
  };

  // Helper function to get secondary text color
  const getSecondaryTextColor = () => {
    return theme.colors.onSurfaceVariant;
  };

  // Helper function to get border color
  const getBorderColor = () => {
    return theme.colors.outlineVariant;
  };

  const getPriorityTextStyle = (priority: 'low' | 'medium' | 'high') => {
    const baseStyle = {
      fontSize: 12,
      fontWeight: '500' as const,
      marginTop: 4,
    };

    const priorityColor = 
      priority === 'high' 
        ? theme.colors.error 
        : priority === 'medium' 
          ? theme.colors.primary 
          : theme.colors.secondary;

    return {
      ...baseStyle,
      color: priorityColor,
    };
  };

  const getPriorityDotColor = (priority: 'low' | 'medium' | 'high') => {
    return priority === 'high' 
      ? theme.colors.error 
      : priority === 'medium' 
        ? theme.colors.primary 
        : theme.colors.onSurfaceVariant;
  };

  // Delete task handler
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const renderTask = ({ item }: { item: Task }) => (
    <Card 
      style={[styles.taskCard, { 
        borderLeftWidth: 4, 
        borderLeftColor: getPriorityColor(item.priority),
        backgroundColor: theme.colors.surface,
        marginBottom: 8,
        elevation: 2,
      }]}
    >
      <View style={styles.taskContent}>
        <TouchableOpacity 
          onPress={() => toggleTaskCompletion(item.id)}
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          <View style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: item.completed ? theme.colors.primary : theme.colors.outlineVariant,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}>
            {item.completed && (
              <MaterialCommunityIcons 
                name="check" 
                size={18} 
                color={theme.colors.primary} 
              />
            )}
          </View>
        </TouchableOpacity>
        
        <View style={{ flex: 1 }}>
          <Text 
            style={[{
              fontSize: 16,
              fontWeight: '500',
              color: theme.colors.onSurface,
            }, item.completed && { 
              textDecorationLine: 'line-through',
              color: theme.colors.onSurfaceVariant,
            }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          
          {item.description ? (
            <Text 
              style={[{
                fontSize: 14,
                color: theme.colors.onSurfaceVariant,
                marginTop: 4,
              }, item.completed && { 
                color: theme.colors.onSurfaceVariant,
                opacity: 0.7,
              }]}
              numberOfLines={1}
            >
              {item.description}
            </Text>
          ) : null}
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 4,
          }}>
            <MaterialCommunityIcons 
              name="clock-outline" 
              size={14} 
              color={theme.colors.onSurfaceVariant} 
              style={{ marginRight: 4 }} 
            />
            <Text 
              style={[{
                fontSize: 12,
                color: theme.colors.onSurfaceVariant,
              }, item.completed && { 
                color: theme.colors.onSurfaceVariant,
                opacity: 0.7,
              }]}
            >
              {item.time}
            </Text>
          </View>
          
          <Text style={getPriorityTextStyle(item.priority)}>
            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
          </Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => handleDeleteTask(item.id)}
          style={{
            padding: 8,
            borderRadius: 20,
            backgroundColor: theme.colors.error + '10',
          }}
        >
          <MaterialCommunityIcons 
            name="trash-can-outline" 
            size={20} 
            color={theme.colors.error} 
          />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface, padding: 16, borderRadius: 12, marginBottom: 16, elevation: 2 }]}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.onSurface }}>
            {format(selectedDate, 'EEEE, MMMM d')}
          </Text>
          <Text style={{ fontSize: 16, color: theme.colors.primary, marginTop: 4 }}>
            {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE')}
          </Text>
        </View>
        <Button 
          mode="outlined" 
          onPress={() => {}}
          style={{ borderColor: theme.colors.outline }}
          labelStyle={{ color: theme.colors.primary }}
          icon="calendar-month"
        >
          Calendar
        </Button>
      </View>

      <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 }]}>
        <View style={styles.statItem}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.primary }}>
            {tasks.filter(t => t.completed).length}
          </Text>
          <Text style={{ fontSize: 14, color: theme.colors.onSurfaceVariant, marginTop: 4 }}>Completed</Text>
        </View>
        <View style={[styles.statItem, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: theme.colors.outlineVariant, paddingHorizontal: 16 }]}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.onSurface }}>
            {tasks.length}
          </Text>
          <Text style={{ fontSize: 14, color: theme.colors.onSurfaceVariant, marginTop: 4 }}>Total Tasks</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.error }}>
            {tasks.filter(t => t.priority === 'high' && !t.completed).length}
          </Text>
          <Text style={{ fontSize: 14, color: theme.colors.onSurfaceVariant, marginTop: 4 }}>High Priority</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: theme.colors.onSurface }}>
          Today's Schedule
        </Text>
        <TouchableOpacity>
          <Text style={{ color: theme.colors.primary, fontWeight: '500' }}>View All</Text>
        </TouchableOpacity>
      </View>

      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.taskList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
          backgroundColor: theme.colors.background,
        }}>
          <MaterialCommunityIcons 
            name="calendar-blank-outline" 
            size={64} 
            color={theme.colors.onSurfaceVariant} 
            style={{ marginBottom: 16 }}
          />
          <Text style={{
            fontSize: 18,
            fontWeight: '500',
            color: theme.colors.onSurface,
            marginBottom: 24,
            textAlign: 'center',
          }}>
            No tasks scheduled for today
          </Text>
          <Button 
            mode="contained"
            onPress={() => setShowAddModal(true)}
            style={{
              backgroundColor: theme.colors.primary,
              width: '100%',
              maxWidth: 300,
            }}
            labelStyle={{
              color: theme.colors.onPrimary,
              fontWeight: '600',
              fontSize: 16,
              paddingVertical: 8,
            }}
          >
            Add Your First Task
          </Button>
        </View>
      )}

      <FAB
        style={[
          styles.fab,
          {
            backgroundColor: theme.colors.primary,
            position: 'absolute',
            right: 16,
            bottom: 80, // Move up above bottom tab bar
            zIndex: 10,
          }
        ]}
        icon="plus"
        onPress={() => setShowAddModal(true)}
        color="white"
      />

      {/* Add Task Modal */}
      <Portal>
        <Modal 
          visible={showAddModal} 
          onDismiss={() => setShowAddModal(false)}
          contentContainerStyle={[
            styles.modalContainer, 
            { backgroundColor: theme.colors.surface, minHeight: 300, justifyContent: 'center' }
          ]}
        >
          <ScrollView>
            <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
              Add New Task
            </Text>
            
            <TextInput
              label="Task Title"
              value={newTask.title}
              onChangeText={(text) => setNewTask({...newTask, title: text})}
              mode="outlined"
              style={styles.input}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                  text: theme.colors.onSurface,
                  placeholder: theme.colors.onSurfaceVariant,
                },
              }}
            />

            <TextInput
              label="Description"
              value={newTask.description}
              onChangeText={(text) => setNewTask({...newTask, description: text})}
              mode="outlined"
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                  text: theme.colors.onSurface,
                  placeholder: theme.colors.onSurfaceVariant,
                },
              }}
            />

            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4 }}>
                Time
              </Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.timeButtonText}>{newTask.time}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.priorityButtons}>
              {(['low', 'medium', 'high'] as const).map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    { 
                      borderColor: theme.colors.outlineVariant,
                      ...(newTask.priority === priority && { 
                        backgroundColor: `${getPriorityColor(priority)}20`,
                        borderColor: getPriorityColor(priority),
                      }),
                    },
                  ]}
                  onPress={() => setNewTask({...newTask, priority})}
                >
                  <Text 
                    style={[
                      styles.priorityButtonText,
                      { 
                        color: newTask.priority === priority 
                          ? getPriorityColor(priority) 
                          : theme.colors.onSurfaceVariant,
                      },
                    ]}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.modalButtons}>
              <Button 
                mode="outlined" 
                onPress={() => setShowAddModal(false)}
                style={[styles.modalButton, styles.cancelButton]}
                labelStyle={styles.cancelButtonText}
              >
                Cancel
              </Button>
              <Button 
                mode="contained" 
                onPress={handleAddTask}
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                labelStyle={styles.addButtonText}
                disabled={!newTask.title.trim()}
              >
                Add Task
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
      
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
    </SafeAreaView>
  );
};

// Create a function that returns styles with theme access
const makeStyles = (theme: MD3Theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  date: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  today: {
    fontSize: 16,
    marginTop: 4,
  },
  calendarButton: {
    borderRadius: 12,
    borderColor: theme.colors.primary,
  },
  calendarButtonText: {
    color: theme.colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  taskList: {
    flex: 1,
  },
  taskCard: {
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  taskLeft: {
    flex: 1,
    marginLeft: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  taskDescription: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  taskTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeIcon: {
    marginRight: 4,
  },
  taskTime: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  priorityTextHigh: {
    color: theme.colors.error,
  },
  priorityTextMedium: {
    color: theme.colors.primary,
  },
  priorityTextLow: {
    color: theme.colors.secondary,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80, // Match the value above for consistency
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
  },
  modalContainer: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.onSurface,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  timePriorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timePickerContainer: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: theme.colors.onSurfaceVariant,
  },
  timeButton: {
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 4,
    padding: 8,
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  priorityContainer: {
    flex: 1,
    marginLeft: 16,
  },
  priorityLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: theme.colors.onSurfaceVariant,
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderColor: theme.colors.outlineVariant,
  },
  priorityButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  modalButton: {
    marginLeft: 8,
    minWidth: 100,
  },
  cancelButton: {
    borderColor: theme.colors.surfaceVariant,
  },
  cancelButtonText: {
    color: theme.colors.onSurfaceVariant,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

// Export the component with styles
const ThemedDailyPlanScreen = () => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  
  return <DailyPlanScreen styles={styles} />;
};

export default ThemedDailyPlanScreen;
