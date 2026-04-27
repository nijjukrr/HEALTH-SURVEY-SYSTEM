import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { Profile } from '../types/profile';

interface ProfileSetupProps {
  userId: string;
  onProfileComplete: () => void;
}

export default function ProfileSetup({ userId, onProfileComplete }: ProfileSetupProps) {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Profile['role']>('volunteer');
  const [organization, setOrganization] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata) {
        setFullName(user.user_metadata.full_name || '');
        setRole(user.user_metadata.role || 'volunteer');
        setOrganization(user.user_metadata.organization || '');
        setLocation(user.user_metadata.location || '');
      }
    };
    getUserData();
  }, []);

  const roles: { value: Profile['role']; label: string; icon: string }[] = [
    { value: 'admin', label: 'Admin', icon: 'shield-checkmark' },
    { value: 'clinic', label: 'Clinic', icon: 'medkit' },
    { value: 'asha_worker', label: 'ASHA Worker', icon: 'medical' },
    { value: 'volunteer', label: 'Volunteer', icon: 'people' },
  ];

  const handleSubmit = async () => {
    if (!fullName || !organization || !location) {
      Alert.alert('Missing Fields', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('profiles').insert({
        id: userId,
        full_name: fullName,
        role,
        organization,
        location,
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        onProfileComplete();
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Please provide your details to get started</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your full name"
              placeholderTextColor="#AEAEB2"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Role</Text>
            <View style={styles.roleContainer}>
              {roles.map((roleOption) => (
                <TouchableOpacity
                  key={roleOption.value}
                  style={[
                    styles.roleButton,
                    role === roleOption.value && styles.roleButtonSelected,
                  ]}
                  onPress={() => setRole(roleOption.value)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={roleOption.icon as any} size={16} color={role === roleOption.value ? '#007AFF' : '#636366'} style={styles.roleIcon} />
                  <Text
                    style={[
                      styles.roleButtonText,
                      role === roleOption.value && styles.roleButtonTextSelected,
                    ]}
                  >
                    {roleOption.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Organization</Text>
            <TextInput
              style={styles.input}
              placeholder="Your organization"
              placeholderTextColor="#AEAEB2"
              value={organization}
              onChangeText={setOrganization}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Your location"
              placeholderTextColor="#AEAEB2"
              value={location}
              onChangeText={setLocation}
              autoCapitalize="words"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Complete Setup</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.36,
  },
  subtitle: {
    fontSize: 15,
    color: '#636366',
    textAlign: 'center',
    marginBottom: 28,
  },
  inputContainer: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636366',
    marginBottom: 6,
    letterSpacing: -0.08,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 17,
    backgroundColor: '#F2F2F7',
    color: '#1C1C1E',
    letterSpacing: -0.41,
  },
  roleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#F2F2F7',
  },
  roleButtonSelected: {
    backgroundColor: '#007AFF18',
    borderColor: '#007AFF',
  },
  roleIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  roleButtonText: {
    color: '#636366',
    fontSize: 14,
    fontWeight: '500',
  },
  roleButtonTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
});