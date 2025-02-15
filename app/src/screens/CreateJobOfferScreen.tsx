import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

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
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Offer Creation</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Title Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Offer title</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter the title of your offer"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
          <Text style={styles.inputInfo}>
            This title will be publicly displayed
          </Text>
        </View>

        {/* Description Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Offer description</Text>
          <TextInput
            style={[styles.textInput, styles.textAreaInput]}
            placeholder="Describe the offer in detail"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
          />
          <Text style={styles.inputInfo}>
            Be clear and attractive to attract users
          </Text>
        </View>

        {/* Start Date Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Beginning date</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Select the start date of the offer"
            value={formData.startDate}
            onChangeText={(text) =>
              setFormData({ ...formData, startDate: text })
            }
          />
          <Text style={styles.inputInfo}>
            The offer will be active from this date
          </Text>
        </View>

        {/* End Date Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Closing date</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Select the end date of the offer"
            value={formData.endDate}
            onChangeText={(text) => setFormData({ ...formData, endDate: text })}
          />
          <Text style={styles.inputInfo}>
            The offer will expire after this date
          </Text>
        </View>

        {/* Price Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Offer price</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter offer price"
            keyboardType="numeric"
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
          />
          <Text style={styles.inputInfo}>
            Indicate the exact amount of the offer
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create the offer</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(251, 249, 250, 1)",
  },
  topBar: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 4,
    minHeight: 60,
  },
  topBarContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
  },
  content: {
    flex: 1,
    padding: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
  },
  textAreaInput: {
    height: 100,
    textAlignVertical: "top",
  },
  inputInfo: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginVertical: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CreateJobOfferScreen;
