import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/createJobOfferStyles";

const CreateJobOfferScreen: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    price: "",
  });

  const handleSubmit = () => {
    // TODO: Implement job offer creation logic
    console.log("Form submitted:", formData);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.topBarContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Create Job Offer</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Title Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter the job offer title"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
          <Text style={styles.inputInfo}>
            This title will be visible to the public
          </Text>
        </View>

        {/* Description Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.textAreaInput]}
            placeholder="Provide a detailed description of the job"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
          />
          <Text style={styles.inputInfo}>
            Be specific and engaging to attract candidates
          </Text>
        </View>

        {/* Start Date Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Start Date</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Select the job start date"
            value={formData.startDate}
            onChangeText={(text) =>
              setFormData({ ...formData, startDate: text })
            }
          />
          <Text style={styles.inputInfo}>
            The job offer will be active from this date
          </Text>
        </View>

        {/* End Date Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>End Date</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Select the job end date"
            value={formData.endDate}
            onChangeText={(text) => setFormData({ ...formData, endDate: text })}
          />
          <Text style={styles.inputInfo}>
            The job offer will expire on this date
          </Text>
        </View>

        {/* Price Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Price</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter the job price"
            keyboardType="numeric"
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
          />
          <Text style={styles.inputInfo}>
            Specify the exact amount for this job
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Job Offer</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateJobOfferScreen;
