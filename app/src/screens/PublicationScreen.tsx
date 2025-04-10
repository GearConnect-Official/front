import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/publicationStyles';
import postService from '../services/postService';

import Header from '../components/Publication/Header';
import MediaSection from '../components/Publication/MediaSection';
import ImageViewer from '../components/Publication/ImageViewer';
import PublicationForm from '../components/Publication/PublicationForm';

const PublicationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState<'select' | 'crop' | 'form'>('select');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoBack = () => {
    if (step !== 'select') {
      Alert.alert(
        'Discard Post?',
        'If you go back now, you will lose your post.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => {
              setSelectedImage(null);
              setCroppedImage(null);
              setTitle('');
              setDescription('');
              setTags([]);
              setStep('select');
              navigation.goBack();
            }
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleShare = async () => {
    const imageToShare = croppedImage || selectedImage;
    
    if (!imageToShare || !title.trim()) {
      Alert.alert('Error', 'Please add an image and title');
      return;
    }

    try {
      setIsLoading(true);
      
      // Preparing the data model according to the Prisma schema
      // Corresponding to Post model { id, title, body, user, userId, image, imageId, tags, interactions, createdAt }
      const post = {
        title: title,
        body: description,
        userId: 1, // Replace with the ID of the logged-in user
        image: imageToShare,
        tags: tags.length > 0 ? tags.map(tag => ({ name: tag })) : undefined,
      };
      
      console.log("\n\n=========== DATA TO SEND TO THE BACKEND ===========");
      console.log("Format expected by the Prisma model:");
      console.log(`
model Post {
  id            Int           @id @default(autoincrement())
  title         String
  body          String
  user          User          @relation(fields: [userId], references: [id])
  userId        Int
  image         Photo?        @relation(fields: [imageId], references: [id])
  imageId       Int?
  tags          PostTag[]
  interactions  Interaction[]
  createdAt     DateTime      @default(now())
}
      `);
      
      // API call to create the post
      const response = await postService.createPost(post);
      console.log('Post created:', response);
      
      // If the post has tags, add them
      if (tags.length > 0 && response.id) {
        console.log('\nAdding tags to post:');
        await Promise.all(
          tags.map(tag => {
            console.log(`- Tag: ${tag}`);
            return postService.addTagToPost(response.id, { name: tag });
          })
        );
      }
      
      setSelectedImage(null);
      setCroppedImage(null);
      setTitle('');
      setDescription('');
      setTags([]);
      setStep('select');
      
      Alert.alert('Success', 'Your post has been shared successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('\n❌ ERROR CREATING POST:');
      console.error(error);
      console.log('\n📋 BACKEND INSTRUCTIONS:');
      console.log(`
To make this feature work, you need to implement the following routes:

1. POST /api/posts
   - Creates a new post
   - Request body: { title, body, userId, image, tags? }
   - Returns: The created post with its ID

2. POST /api/posts/:postId/tags 
   - Adds a tag to an existing post
   - Request body: { name }
   - Returns: The created tag

3. GET /api/posts
   - Retrieves all posts
   - Returns: List of posts

4. POST /api/posts/:postId/interactions
   - Adds an interaction (like, comment, share) to a post
   - Request body: { type, userId, content?, createdAt }
   - Returns: The created interaction
`);
      Alert.alert('Error', 'Failed to share post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelected = (uri: string) => {
    setSelectedImage(uri);
    setCroppedImage(uri);
    setStep('crop');
  };

  const handleImageChange = (newUri: string) => {
    setCroppedImage(newUri);
  };

  const handleNext = () => {
    if (step === 'crop') {
      if (!croppedImage && !selectedImage) {
        Alert.alert('Error', 'Please select an image first');
        return;
      }
      setStep('form');
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'form':
        setStep('crop');
        break;
      case 'crop':
        setStep('select');
        break;
      default:
        handleGoBack();
    }
  };

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };

  const renderContent = () => {
    switch (step) {
      case 'select':
        return <MediaSection onImageSelected={handleImageSelected} />;
      
      case 'crop':
        return selectedImage ? (
          <ImageViewer
            imageUri={selectedImage}
            onImageChange={handleImageChange}
            onNext={handleNext}
            onGoBack={handleBack}
            isLastStep={false}
          />
        ) : null;
      
      case 'form':
        const imageToShow = croppedImage || selectedImage;
        return imageToShow ? (
          <PublicationForm
            imageUri={imageToShow}
            title={title}
            description={description}
            tags={tags}
            setTitle={setTitle}
            setDescription={setDescription}
            setTags={handleTagsChange}
            username="Username" // Replace with the real username
            userAvatar="https://via.placeholder.com/32" // Replace with the real avatar
            isLoading={isLoading}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        isCropping={step === 'crop'}
        isLastStep={step === 'form'}
        onBack={handleBack}
        onConfirm={handleNext}
        onNext={step === 'form' ? handleShare : handleNext}
        onGoBack={handleGoBack}
        isLoading={isLoading}
      />
      {renderContent()}
    </View>
  );
};

export default PublicationScreen;