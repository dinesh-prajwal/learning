import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Platform,
  TextInput,
} from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { googleLogin, usernamePasswordLogin } from './api/auth.api';

// Google OAuth 2.0 Client ID (Web Client ID from Google Cloud Console)
// This is required for both Android and iOS to get the ID token
const GOOGLE_WEB_CLIENT_ID = '';


GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID, // Required for getting idToken on both platforms
  offlineAccess: true, // If you want to access Google API on behalf of the user FROM YOUR SERVER
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  iosClientId: '', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Check if user is already signed in on component mount
  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      // Try to get current user (will throw if not signed in)
      const currentUser = await GoogleSignin.getCurrentUser();
      if (currentUser) {
        console.log('Current user already signed in:', currentUser);
      }
    } catch (error) {
      // User is not signed in, which is fine
      console.log('No current user signed in');
    }
  };

  const handleUsernamePasswordLogin = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Validate inputs
      if (!username.trim()) {
        throw new Error('Please enter your username');
      }
      if (!password.trim()) {
        throw new Error('Please enter your password');
      }

      // Call backend API for username/password login
      const response = await usernamePasswordLogin(username.trim(), password);
      
      if (response.success) {
        Alert.alert(
          'Success',
          `Welcome back, ${response.user?.username || username}!`,
          [{ text: 'OK' }]
        );
        
        // Log user info for debugging
        console.log('Login Response:', {
          user: response.user,
          token: response.token ? 'Token received' : 'No token',
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Username/Password Login Error:', error);
      const errorMessage = error.message || 'Login failed. Please try again.';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError('');

      // Check if Google Play Services are available (Android only)
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      }

      // Sign out and revoke access to force account picker to show
      // This ensures users can select a different account each time
      try {
        // Revoke access first (clears the token and forces account selection)
        await GoogleSignin.revokeAccess();
      } catch (revokeError) {
        // Ignore revoke errors (user might not be signed in)
        console.log('Revoke access failed (user may not be signed in):', revokeError);
      }
      
      try {
        // Sign out to clear any cached session
        await GoogleSignin.signOut();
      } catch (signOutError) {
        // Ignore sign out errors (user might not be signed in)
        console.log('Sign out failed (user may not be signed in):', signOutError);
      }

      // Sign in with Google (this will now show the account picker)
      const result = await GoogleSignin.signIn();
      
      // Check if sign-in was successful
      if (result.type !== 'success') {
        throw new Error('Sign-in was cancelled or failed');
      }

      // Access idToken and user info from the nested data object
      const idToken = result.data.idToken;
      const userInfo = result.data.user;
      
      if (!idToken) {
        throw new Error('Failed to get ID token from Google. Please ensure webClientId is properly configured in Google Cloud Console.');
      }

      console.log('Google Sign-In Success:', {
        idToken: idToken.substring(0, 20) + '...',
        user: userInfo,
      });

      // Call backend API to verify token and create session
      try {
        const authResponse = await googleLogin(idToken);
        
        if (authResponse.success) {
          // Display success message with user info
          const userName = userInfo?.name || userInfo?.email || 'User';
          Alert.alert(
            'Success', 
            `Signed in successfully!\n\nWelcome, ${userName}!`,
            [{ text: 'OK' }]
          );
          
          // Log user info for debugging
          console.log('Backend Auth Response:', {
            user: authResponse.user,
            token: authResponse.token ? 'Token received' : 'No token',
          });
        } else {
          throw new Error(authResponse.message || 'Backend authentication failed');
        }
      } catch (apiError: any) {
        // If backend is not available, still show success for Google sign-in
        console.warn('Backend API error (continuing with Google sign-in):', apiError);
        const userName = userInfo?.name || userInfo?.email || 'User';
        Alert.alert(
          'Google Sign-In Success', 
          `Signed in with Google!\n\nWelcome, ${userName}!\n\nNote: Backend connection failed.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      
      let errorMessage = 'Google sign-in failed. Please try again.';
      
      // Handle specific error codes
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = 'Sign in was cancelled';
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Sign in is already in progress';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Google Play Services not available. Please update Google Play Services.';
      } else if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        errorMessage = 'Sign in required';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      Alert.alert('Success', 'Signed out successfully');
      setError('');
    } catch (error: any) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo & Branding */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>DP</Text>
            </View>
          </View>
          
          <Text style={styles.appName}>
            DevPrep <Text style={styles.appNameSuffix}>AI</Text>
          </Text>
          
          <Text style={styles.tagline}>Master your tech interviews</Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey</Text>
          </View>

          <View style={styles.cardBody}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#94a3b8"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            
            {/* Username/Password Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, (isLoading || !username.trim() || !password.trim()) && styles.buttonDisabled]}
              onPress={handleUsernamePasswordLogin}
              disabled={isLoading || !username.trim() || !password.trim()}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Google Sign In Button */}
          <TouchableOpacity
            style={[styles.googleButton, isGoogleLoading && styles.buttonDisabled]}
            onPress={handleGoogleSignIn}
            disabled={isGoogleLoading}
            activeOpacity={0.8}
          >
            {isGoogleLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <View style={styles.googleIcon}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Powered by AI • Built for developers</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // slate-900
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981', // emerald-500
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10b981', // emerald-400
    marginBottom: 8,
  },
  appNameSuffix: {
    color: '#e2e8f0', // slate-200
  },
  tagline: {
    fontSize: 16,
    color: '#94a3b8', // slate-400
    marginTop: 8,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1e293b', // slate-800
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: '#334155', // slate-700
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e2e8f0', // slate-200
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8', // slate-400
  },
  cardBody: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#0f172a', // slate-900
    borderWidth: 1,
    borderColor: '#334155', // slate-700
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#e2e8f0', // slate-200
    marginBottom: 16,
    minHeight: 56,
  },
  loginButton: {
    backgroundColor: '#10b981', // emerald-500
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155', // slate-700
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#94a3b8', // slate-400
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#7f1d1d', // red-900/50
    borderWidth: 1,
    borderColor: '#ef4444', // red-500
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  errorText: {
    color: '#fca5a5', // red-300
    fontSize: 14,
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b', // slate-800
    borderWidth: 1,
    borderColor: '#475569', // slate-600
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 56,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleIconText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4285f4',
  },
  googleButtonText: {
    color: '#e2e8f0', // slate-200
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    marginTop: 32,
    fontSize: 12,
    color: '#475569', // slate-600
    textAlign: 'center',
  },
});
