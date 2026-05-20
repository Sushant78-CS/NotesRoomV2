import { Stack } from "expo-router";
import React from "react";

const GroupLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="profile" />
    </Stack>
  );
};

export default GroupLayout;
