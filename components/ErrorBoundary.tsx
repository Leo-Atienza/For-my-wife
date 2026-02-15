import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { THEMES } from '@/lib/constants';
import { useCoupleStore } from '@/stores/useCoupleStore';

function getThemeColors() {
  const themeName = useCoupleStore.getState().profile?.theme ?? 'rose';
  return THEMES[themeName];
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const colors = getThemeColors();
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 32,
            gap: 16,
          }}
        >
          <Text style={{ fontSize: 48 }}>{'\ud83d\udc94'}</Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              color: colors.textPrimary,
              textAlign: 'center',
            }}
          >
            Something went wrong
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: colors.textMuted,
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            Don&apos;t worry, your data is safe. Try reloading the app.
          </Text>
          {__DEV__ && this.state.error && (
            <Text
              style={{
                fontSize: 12,
                color: colors.danger,
                textAlign: 'center',
                marginTop: 8,
              }}
            >
              {this.state.error.message}
            </Text>
          )}
          <Pressable
            onPress={this.handleReload}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 9999,
              paddingHorizontal: 32,
              paddingVertical: 14,
              marginTop: 16,
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              Reload App
            </Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

/**
 * Lighter error boundary for individual screens.
 * Catches crashes in a single screen without taking down the entire app.
 */
export class ScreenErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ScreenErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const colors = getThemeColors();
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 32,
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 36 }}>{'\ud83d\ude15'}</Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: colors.textPrimary,
              textAlign: 'center',
            }}
          >
            This screen ran into an issue
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.textMuted,
              textAlign: 'center',
              lineHeight: 20,
            }}
          >
            Your data is safe. Tap below to try again.
          </Text>
          {__DEV__ && this.state.error && (
            <Text
              style={{
                fontSize: 11,
                color: colors.danger,
                textAlign: 'center',
                marginTop: 4,
              }}
            >
              {this.state.error.message}
            </Text>
          )}
          <Pressable
            onPress={this.handleRetry}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 9999,
              paddingHorizontal: 24,
              paddingVertical: 12,
              marginTop: 12,
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: '600',
              }}
            >
              Try Again
            </Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
