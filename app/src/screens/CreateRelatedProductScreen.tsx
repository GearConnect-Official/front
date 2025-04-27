import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { API_URL_RELATEDPRODUCTS } from '../config';

type RootStackParamList = {
  CreateRelatedProduct: { eventId: string };
  EventDetails: { eventId: string };
};

type CreateRelatedProductScreenRouteProps = RouteProp<RootStackParamList, 'CreateRelatedProduct'>;

const CreateRelatedProductScreen: React.FC = () => {
  const route = useRoute<CreateRelatedProductScreenRouteProps>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  const { eventId } = route.params;
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleCreateProduct = async () => {
    // Basic validation
    if (!name || !description || !price || !quantity) {
      setError('Please fill all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL_RELATEDPRODUCTS}/products`, {
        name,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        eventId,
      });
      
      setIsLoading(false);
      Alert.alert(
        'Success',
        'Product created successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('EventDetails', { eventId })
          }
        ]
      );
    } catch (err) {
      setIsLoading(false);
      setError('Failed to create product. Please try again.');
      console.error('Error creating product:', err);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Related Product</Text>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Product Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter product name"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter product description"
          multiline
          numberOfLines={4}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Price ($)</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="0.00"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          placeholder="0"
          keyboardType="numeric"
        />
      </View>
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateProduct}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Product</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default CreateRelatedProductScreen;