import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Button, FAB, useTheme, Portal, Modal, TextInput, Checkbox } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
};

const initialTodos: TodoItem[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    completed: false,
    priority: 'high',
  },
  {
    id: '2',
    title: 'Buy groceries',
    completed: true,
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Call mom',
    completed: false,
    priority: 'low',
  },
];

const TodoScreen = () => {
  const theme = useTheme();
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTodo, setNewTodo] = useState<Omit<TodoItem, 'id'>>({ 
    title: '', 
    completed: false, 
    priority: 'medium' 
  });
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  const filteredTodos = todos.filter(todo => {
    if (activeTab === 'active') return !todo.completed;
    if (activeTab === 'completed') return todo.completed;
    return true;
  });

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const addTodo = () => {
    if (!newTodo.title.trim()) return;
    
    const todoToAdd = {
      ...newTodo,
      id: Date.now().toString(),
    };
    
    setTodos([...todos, todoToAdd]);
    setNewTodo({ 
      title: '', 
      completed: false, 
      priority: 'medium' 
    });
    setShowAddModal(false);
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.gray;
    }
  };

  const renderTodoItem = ({ item }: { item: TodoItem }) => (
    <View style={[styles.todoItem, { 
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    }]}>
      <View style={styles.todoLeft}>
        <Checkbox.Android
          status={item.completed ? 'checked' : 'unchecked'}
          onPress={() => toggleTodo(item.id)}
          color={theme.colors.primary}
        />
        <View style={styles.todoTextContainer}>
          <Text 
            style={[
              styles.todoTitle, 
              { 
                color: item.completed ? theme.colors.textDisabled : theme.colors.textPrimary,
                textDecorationLine: item.completed ? 'line-through' : 'none',
              }
            ]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {item.dueDate && (
            <View style={styles.dueDateContainer}>
              <MaterialCommunityIcons 
                name="calendar-clock" 
                size={14} 
                color={theme.colors.textSecondary} 
                style={styles.dueDateIcon}
              />
              <Text style={[styles.dueDateText, { color: theme.colors.textSecondary }]}>
                {item.dueDate}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.todoRight}>
        <View 
          style={[
            styles.priorityIndicator, 
            { backgroundColor: getPriorityColor(item.priority) }
          ]} 
        />
        <TouchableOpacity 
          onPress={() => deleteTodo(item.id)}
          style={styles.deleteButton}
        >
          <MaterialCommunityIcons 
            name="trash-can-outline" 
            size={20} 
            color={theme.colors.error} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          My Tasks
        </Text>
        <View style={styles.tabs}>
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'Active' },
            { id: 'completed', label: 'Completed' },
          ].map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && [
                  styles.activeTab,
                  { backgroundColor: theme.colors.primary },
                ],
              ]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              <Text 
                style={[
                  styles.tabText,
                  { 
                    color: activeTab === tab.id 
                      ? theme.colors.surface 
                      : theme.colors.textSecondary 
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {filteredTodos.length > 0 ? (
        <FlatList
          data={filteredTodos}
          renderItem={renderTodoItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.todoList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons 
            name="clipboard-text-outline" 
            size={64} 
            color={theme.colors.gray} 
          />
          <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
            {activeTab === 'all' 
              ? 'No tasks yet. Add your first task!' 
              : activeTab === 'active' 
                ? 'No active tasks. All caught up!' 
                : 'No completed tasks yet.'}
          </Text>
          {activeTab !== 'completed' && (
            <Button 
              mode="contained" 
              onPress={() => setShowAddModal(true)}
              style={styles.addFirstTaskButton}
              labelStyle={styles.addFirstTaskButtonText}
            >
              Add Your First Task
            </Button>
          )}
        </View>
      )}

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => setShowAddModal(true)}
        color="white"
      />

      {/* Add Todo Modal */}
      <Portal>
        <Modal 
          visible={showAddModal} 
          onDismiss={() => setShowAddModal(false)}
          contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
            Add New Task
          </Text>
          
          <TextInput
            label="Task Title"
            value={newTodo.title}
            onChangeText={text => setNewTodo({...newTodo, title: text})}
            mode="outlined"
            style={styles.input}
            theme={{
              colors: {
                primary: theme.colors.primary,
                text: theme.colors.textPrimary,
                placeholder: theme.colors.textDisabled,
              },
            }}
          />
          
          <View style={styles.priorityContainer}>
            <Text style={[styles.priorityLabel, { color: theme.colors.textSecondary }]}>
              Priority:
            </Text>
            {(['low', 'medium', 'high'] as const).map(priority => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.priorityButton,
                  newTodo.priority === priority && { 
                    backgroundColor: getPriorityColor(priority) + '20',
                    borderColor: getPriorityColor(priority),
                  },
                  { borderColor: theme.colors.border },
                ]}
                onPress={() => setNewTodo({...newTodo, priority})}
              >
                <View 
                  style={[
                    styles.priorityDot, 
                    { backgroundColor: getPriorityColor(priority) }
                  ]} 
                />
                <Text 
                  style={[
                    styles.priorityText, 
                    { 
                      color: newTodo.priority === priority 
                        ? getPriorityColor(priority) 
                        : theme.colors.textSecondary
                    }
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
              onPress={addTodo}
              style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
              labelStyle={styles.addButtonText}
              disabled={!newTodo.title.trim()}
            >
              Add Task
            </Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F3F9',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  todoList: {
    paddingBottom: 100,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 1,
  },
  todoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  todoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dueDateIcon: {
    marginRight: 4,
  },
  dueDateText: {
    fontSize: 12,
  },
  todoRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  deleteButton: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  addFirstTaskButton: {
    borderRadius: 12,
    paddingHorizontal: 24,
  },
  addFirstTaskButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 28,
  },
  modalContainer: {
    padding: 24,
    margin: 20,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  priorityLabel: {
    fontSize: 14,
    marginRight: 12,
  },
  priorityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  cancelButton: {
    borderColor: colors.gray,
  },
  cancelButtonText: {
    color: colors.textSecondary,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default TodoScreen;
