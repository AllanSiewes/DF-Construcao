import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { ProjectsScreen } from '../screens/projects/ProjectsScreen';
import { TransactionsScreen } from '../screens/transactions/TransactionsScreen';
import { ReportsScreen } from '../screens/reports/ReportsScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { Colors, Radius } from '../theme';
import { DFText } from '../components/common/DFText';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, [string, string]> = {
  'Início': ['home', 'home-outline'],
  'Obras': ['construct', 'construct-outline'],
  'Transações': ['swap-vertical', 'swap-vertical-outline'],
  'Relatórios': ['bar-chart', 'bar-chart-outline'],
  'Perfil': ['person-circle', 'person-circle-outline'],
};

export const TabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: Colors.navy,
      tabBarInactiveTintColor: Colors.grayLight,
      tabBarLabelStyle: styles.tabLabel,
      tabBarIcon: ({ focused, color, size }) => {
        const icons = TAB_ICONS[route.name];
        const iconName = focused ? icons[0] : icons[1];
        return (
          <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
            <Ionicons name={iconName as any} size={22} color={color} />
          </View>
        );
      },
    })}
  >
    <Tab.Screen name="Início" component={DashboardScreen} />
    <Tab.Screen name="Obras" component={ProjectsScreen} />
    <Tab.Screen name="Transações" component={TransactionsScreen} />
    <Tab.Screen name="Relatórios" component={ReportsScreen} />
    <Tab.Screen name="Perfil" component={SettingsScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    height: 80,
    paddingBottom: 16,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    backgroundColor: `${Colors.navy}12`,
  },
});
