import { Stack } from "expo-router";
import React from "react";

const GroupLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="creategroup" />
      <Stack.Screen name="joingroup" />
    </Stack>
  );
};

export default GroupLayout;
