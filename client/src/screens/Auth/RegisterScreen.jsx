import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Toast from 'react-native-toast-message';

import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import useAuthStore from '../../store/authStore';
import { COLORS, PATTERNS, SCREENS } from '../../utils/constants';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const { register, isLoading } = useAuthStore();

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!PATTERNS.EMAIL.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone is required';
    } else if (!PATTERNS.PHONE.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number (10 digits starting with 6-9)';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!PATTERNS.PASSWORD.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: 'user'
    });

    if (result.success) {
      Toast.show({
        type: 'success',
        text1: 'Account created!',
        text2: 'Welcome to HealthLink'
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Registration failed',
        text2: result.error || 'Please try again'
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join HealthLink today</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Full Name"
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
            placeholder="John Doe"
            leftIcon="person-outline"
            error={errors.name}
          />

          <Input
            label="Email"
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            placeholder="your.email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
            error={errors.email}
          />

          <Input
            label="Phone Number"
            value={formData.phone}
            onChangeText={(value) => updateField('phone', value)}
            placeholder="9876543210"
            keyboardType="phone-pad"
            leftIcon="call-outline"
            error={errors.phone}
          />

          <Input
            label="Password"
            value={formData.password}
            onChangeText={(value) => updateField('password', value)}
            placeholder="Create a strong password"
            secureTextEntry
            leftIcon="lock-closed-outline"
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(value) => updateField('confirmPassword', value)}
            placeholder="Re-enter your password"
            secureTextEntry
            leftIcon="lock-closed-outline"
            error={errors.confirmPassword}
          />

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={isLoading}
            style={styles.registerButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate(SCREENS.LOGIN)}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40
  },
  header: {
    marginBottom: 32
  },
  backButton: {
    marginBottom: 16
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.text
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary
  },
  formContainer: {
    flex: 1
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 24
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginText: {
    fontSize: 14,
    color: COLORS.textSecondary
  },
  loginLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600'
  }
});

export default RegisterScreen;