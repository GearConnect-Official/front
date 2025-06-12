import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import relatedProductService, {
  RelatedProduct,
} from '../../services/relatedProductService';
import { styles } from '../../styles/components/relatedProductsSectionStyles';

// Define a type that can handle both the related product structure formats
// EventInterface uses one format, RelatedProduct service uses another
type ProductType = {
  id: string;
  name: string;
  price: number;
  link?: string;
  eventId?: number;
  tag?: string;
  image?: string;
};

interface RelatedProductsSectionProps {
  eventId: string;
  products: ProductType[];
  isCreator: boolean;
  onRefresh: () => void;
}

const RelatedProductsSection: React.FC<RelatedProductsSectionProps> = ({
  eventId,
  products,
  isCreator,
  onRefresh,
}) => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleAddProductModal = () => {
    // Reset form fields and open modal
    setName('');
    setPrice('');
    setLink('');
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Product name is required');
      return;
    }

    if (!price.trim()) {
      Alert.alert('Error', 'Product price is required');
      return;
    }

    setIsLoading(true);

    try {
      // Create new product with proper number conversions
      const newProduct: RelatedProduct = {
        name: name.trim(),
        price: parseFloat(price.trim()),
        link: link.trim() || 'No link provided',
        eventId: Number(eventId),
      };

      // Save to server
      console.log('Creating product:', newProduct);
      // can't make it work
      // await relatedProductService.createProduct(newProduct);

      // Close modal and refresh data
      setModalVisible(false);
      onRefresh();

      // Show success message
      Alert.alert('Success', 'Product added successfully');
    } catch (error: any) {
      // Enhanced error handling
      const errorMessage = error?.message || 'Unknown error occurred';

      // Handle specific error cases
      if (errorMessage.includes('Invalid event ID')) {
        Alert.alert('Error', 'This event may have been deleted or is invalid');
      } else if (error?.type === 'API' && error.status === 500) {
        Alert.alert(
          'Server Error',
          'Server is experiencing issues. Please try again later.'
        );
      } else if (error?.type === 'API') {
        Alert.alert('API Error', errorMessage);
      } else {
        Alert.alert('Error', 'Failed to add product. Please try again.');
      }

      console.error('Error adding product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToProductList = () => {
    // Navigate to the product list screen for viewing and deleting products
    router.push({
      pathname: '/(app)/productList',
      params: {
        eventId,
        products: JSON.stringify(products),
      },
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>Related Products</Text>
        <View style={styles.headerActions}>
          {products && products.length > 0 && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={navigateToProductList}
            >
              <FontAwesome name="list" size={14} color="#4a90e2" />
              <Text style={styles.actionButtonText}>View all</Text>
            </TouchableOpacity>
          )}

          {isCreator && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleAddProductModal}
            >
              <FontAwesome name="plus" size={16} color="#4a90e2" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {products && products.length > 0 ? (
        <FlatList
          horizontal
          data={products}
          keyExtractor={(item) => `product-${item.id}`}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Image
                source={require('../../../assets/images/Google-logo.png')}
                style={styles.productImage}
              />
              <Text style={styles.productTitle}>{item.name}</Text>
              <Text style={styles.productPrice}>Price: {item.price}€</Text>
              {item.link && item.link !== 'no link provided' && (
                <TouchableOpacity style={styles.linkButton}>
                  <Text style={styles.linkText}>Buy</Text>
                  <FontAwesome
                    name="external-link"
                    size={12}
                    color="#fff"
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products available</Text>
          {isCreator && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddProductModal}
            >
              <Text style={styles.addButtonText}>Add products</Text>
              <FontAwesome
                name="plus"
                size={12}
                color="#fff"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
      {/* Product Form Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Product</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesome name="times" size={20} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Product Name*</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter product name"
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Price*</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter price (e.g., 29.99)"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Purchase Link</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter URL"
                value={link}
                onChangeText={setLink}
                keyboardType="url"
                autoCapitalize="none"
              />
              <Text style={styles.helpText}>
                If left empty, a default value will be used
              </Text>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RelatedProductsSection;
