import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { TabNavigator } from './TabNavigator';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { ProjectDetailScreen } from '../screens/projects/ProjectDetailScreen';
import { NewProjectScreen } from '../screens/projects/NewProjectScreen';
import { NewTransactionScreen } from '../screens/transactions/NewTransactionScreen';
import { useAuthStore } from '../store';
import { Colors } from '../theme';

const Stack = createStackNavigator();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, loadFromStorage } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.backgroundPrimary }}>
        <ActivityIndicator color={Colors.navy} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: Colors.backgroundPrimary } }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen
              name="DetalheProjeto"
              component={ProjectDetailScreen}
              options={{ presentation: 'card' }}
            />
            <Stack.Screen
              name="NovoProjeto"
              component={NewProjectScreen}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen
              name="NovaTransação"
              component={NewTransactionScreen}
              options={{ presentation: 'modal' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
