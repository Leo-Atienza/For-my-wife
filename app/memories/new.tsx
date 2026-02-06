import { useState } from 'react';
import { View, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import { useMemoriesStore } from '@/stores/useMemoriesStore';
import { useTheme } from '@/hooks/useTheme';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Pressable, Text } from 'react-native';

export default function NewMemoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const addMemory = useMemoriesStore((state) => state.addMemory);

  const [imageUri, setImageUri] = useState('');
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!imageUri || !caption.trim()) return;
    const memoryDate = date.trim() || new Date().toISOString().split('T')[0];
    addMemory(imageUri, caption.trim(), memoryDate, location.trim() || undefined);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <PageHeader title="Add Memory" showBack />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 20,
          gap: 20,
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Image picker */}
        {imageUri ? (
          <Pressable onPress={pickImage}>
            <Image
              source={{ uri: imageUri }}
              style={{
                width: '100%',
                height: 250,
                borderRadius: 16,
              }}
              resizeMode="cover"
            />
          </Pressable>
        ) : (
          <Pressable
            onPress={pickImage}
            style={{
              width: '100%',
              height: 200,
              borderRadius: 16,
              backgroundColor: theme.primarySoft,
              borderWidth: 2,
              borderColor: theme.accent,
              borderStyle: 'dashed',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Camera size={36} color={theme.primary} />
            <Text style={{ fontSize: 14, fontFamily: 'Inter_500Medium', color: theme.primary }}>
              Choose a Photo
            </Text>
          </Pressable>
        )}

        <Input
          value={caption}
          onChangeText={setCaption}
          placeholder="What makes this memory special?"
          label="Caption"
          multiline
          numberOfLines={3}
        />

        <Input
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          label="Date"
          maxLength={10}
        />

        <Input
          value={location}
          onChangeText={setLocation}
          placeholder="e.g., Paris, our favorite cafe"
          label="Location (optional)"
        />

        <View style={{ marginTop: 'auto', paddingTop: 16 }}>
          <Button
            title="Save Memory"
            onPress={handleSave}
            disabled={!imageUri || !caption.trim()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
