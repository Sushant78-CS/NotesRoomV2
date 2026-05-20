import GoogleButton from "@/components/GoogleButton";
import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    const { error } = await signIn.password({
      emailAddress,
      password,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize();
    } else if (signIn.status === "needs_second_factor") {
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      // Check why the sign-in is not complete
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });
    if (signIn.status === "complete") {
      await signIn.finalize();
    }
  };

  if (signIn.status === "needs_client_trust") {
    return (
      <SafeAreaView style={styles.verifyContainer}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <View style={styles.verifyCard}>
              <Text style={styles.verifyTitle}>Verify your email</Text>

              <Text style={styles.verifySubtitle}>
                We sent a verification code to your email address. Enter it
                below to continue.
              </Text>

              <TextInput
                style={styles.verifyInput}
                placeholder="Enter verification code"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={code}
                onChangeText={(code) => setCode(code)}
              />

              <Pressable onPress={handleVerify}>
                <Text style={styles.verifyButtonText}>Verify Account</Text>
              </Pressable>

              <Pressable onPress={() => {}} style={styles.resendButton}>
                <Text style={styles.resendText}>Resend Code</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.mainContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.content}>
              <Text style={styles.title}>Welcome Back</Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Email"
                style={styles.input}
                value={emailAddress}
                autoCapitalize="none"
                onChangeText={setEmailAddress}
                placeholderTextColor={"#868080ff"}
              />

              <TextInput
                placeholder="Password"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                secureTextEntry
                placeholderTextColor={"#868080ff"}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={fetchStatus === "fetching"}
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.orContainer}>
              <Text>OR</Text>
            </View>
            <GoogleButton />
          </View>
          <View style={[styles.bottomSection]}>
            <Text style={styles.bottomText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    paddingTop: 80,
    width: "100%",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  content: {
    marginBottom: 30,
  },
  inputContainer: {
    width: "88%",
    maxWidth: 340,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#000",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#000",
    // padding: 10,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  bottomSection: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  bottomText: {
    fontSize: 16,
    color: "#4e5152ff",
  },
  signUpText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 5,
  },
  signUpLink: {
    color: "#007185",
    fontSize: 16,
    marginLeft: 6,
    fontWeight: "500",
  },
  createAccountButton: {
    marginTop: 18,
    width: 300,
    height: 45,
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#aaa",
    alignItems: "center",
    justifyContent: "center",
  },

  createAccountText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  loader: {
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  loaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 12,
  },

  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
    textAlign: "center",
  },
  successMessage: {
    color: "green",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    textAlign: "center",
  },

  secondaryButton: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
  },
  secondaryButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  verifyContainer: {
    flex: 1,
  },

  verifyCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 28,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },

  iconContainer: {
    width: 78,
    height: 78,
    borderRadius: 24,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 24,
  },

  verifyTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
  },

  verifySubtitle: {
    marginTop: 12,
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },

  verifyInput: {
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    paddingHorizontal: 18,
    fontSize: 16,
    marginTop: 28,
    backgroundColor: "#FAFAFA",
  },

  verifyButton: {
    width: "100%",
    height: 56,
    borderRadius: 18,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  resendButton: {
    marginTop: 20,
    alignSelf: "center",
  },

  resendText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "600",
  },

  orContainer: {
    marginTop: 20,
  },
});
