import { deleteGroup, getAllCreatedGroups } from "@/api/admin";
import {
  getAllGroups,
  getAllJoinedGroups,
  getGroupDetail,
  leaveGroup,
} from "@/api/user";
import { darkTheme, lightTheme } from "@/constants/theme";
import { useThemeMode, useThemeStore } from "@/store/themeStore";
import { Group, GroupDetail } from "@/types/groupTypes";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GroupScreen = () => {
  const mode = useThemeMode();
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const { background, text, card, primary, modalBg } =
    mode === "dark" ? darkTheme : lightTheme;
  const router = useRouter();
  const { signOut } = useAuth();
  const { user } = useUser();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("explore");
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedGroupDetail, setSelectedGroupDetail] =
    useState<GroupDetail | null>(null);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeTab === "explore") {
      await fetchGroups();
    } else if (activeTab === "joined") {
      await fetchJoinedGroups();
    } else if (activeTab === "myGroups") {
      await fetchCreatedGroups();
    }
    setRefreshing(false);
  };

  const handleCopyCode = async (code: string) => {
    await Clipboard.setStringAsync(code);
    ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
  };

  const fetchGroupDetail = async (id: number) => {
    try {
      const res = await getGroupDetail(id);
      setSelectedGroupDetail(res.data);
    } catch (err: any) {
      if (err?.name !== "CanceledError") console.error(err);
    }
  };

  const isAdmin = selectedGroupDetail?.createdById === user?.id;

  const handleLeaveGroup = async () => {
    if (!selectedGroupDetail?.id) {
      return;
    }
    try {
      setLeaveLoading(true);
      await leaveGroup(selectedGroupDetail?.id);
      ToastAndroid.show("You have left the group", ToastAndroid.SHORT);
      setMenuVisible(false);
      setGroups((prev) =>
        prev.filter((group) => group.id !== selectedGroupDetail?.id),
      );
      setMenuVisible(false);
      setSelectedGroupDetail(null);
    } catch (error) {
      console.log(error);
      ToastAndroid.show("Failed to leave group", ToastAndroid.SHORT);
    } finally {
      setLeaveLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroupDetail?.id) {
      return;
    }
    try {
      setLeaveLoading(true);
      await deleteGroup(selectedGroupDetail?.id);
      setMenuVisible(false);
      setGroups((prev) =>
        prev.filter((group) => group.id !== selectedGroupDetail?.id),
      );
      setSelectedGroupDetail(null);
      ToastAndroid.show("You have deleted the group", ToastAndroid.SHORT);
    } catch (error) {
      console.log(error);
      ToastAndroid.show("Failed to delete group", ToastAndroid.SHORT);
      setMenuVisible(false);
    } finally {
      setLeaveLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (activeTab === "explore") {
        fetchGroups();
      } else if (activeTab === "joined") {
        fetchJoinedGroups();
      } else if (activeTab === "myGroups") {
        fetchCreatedGroups();
      }
    }, [activeTab]),
  );

  const handleLogOut = async () => {
    await signOut();
  };

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await getAllGroups();
      setGroups(res.data);
      setActiveTab("explore");
    } catch (err: any) {
      if (err?.name !== "CanceledError") console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinedGroups = async () => {
    setLoading(true);
    try {
      const res = await getAllJoinedGroups();
      setGroups(res.data);
      setActiveTab("joined");
    } catch (err: any) {
      if (err?.name !== "CanceledError") console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCreatedGroups = async () => {
    setLoading(true);
    try {
      const res = await getAllCreatedGroups();
      setGroups(res.data);
      setActiveTab("myGroups");
    } catch (err: any) {
      if (err?.name !== "CanceledError") console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = () => {
    setShowModal(true);
  };

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{
        flex: 1,
        backgroundColor: background,
      }}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: background,
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: text }]}>Groups</Text>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.push("/screens/profile")}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 8,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: primary,
                }}
              >
                <Ionicons name="person-outline" size={20} color={"#fff"} />
                {/* Project ID: notesroom-496810 */}
                {/* keytool -keystore path-to-debug-or-production-keystore -list -v */}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: card,
            marginHorizontal: 16,
            borderRadius: 18,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor:
                activeTab === "explore" ? primary : "transparent",
            }}
            onPress={() => setActiveTab("explore")}
          >
            <Text
              style={{
                color: activeTab === "explore" ? "#fff" : text,
                fontWeight: "600",
                fontSize: 14,
              }}
            >
              Explore
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor: activeTab === "joined" ? primary : "transparent",
            }}
            onPress={() => setActiveTab("joined")}
          >
            <Text
              style={{
                color: activeTab === "joined" ? "#fff" : text,
                fontWeight: "500",
                fontSize: 14,
              }}
            >
              Joined
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor:
                activeTab === "myGroups" ? primary : "transparent",
            }}
            onPress={() => setActiveTab("myGroups")}
          >
            <Text
              style={{
                color: activeTab === "myGroups" ? "#fff" : text,
                fontWeight: "500",
                fontSize: 14,
              }}
            >
              My Groups
            </Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={primary} />

            <Text
              style={[
                styles.loaderText,
                {
                  color: text,
                },
              ]}
            >
              Loading groups...
            </Text>
          </View>
        ) : groups.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color="#bbb" />

            <Text style={styles.emptyText}>No groups yet</Text>

            <Text style={styles.subText}>Tap + to create your first group</Text>
          </View>
        ) : (
          <FlatList
            data={groups}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            keyExtractor={(item, index) =>
              item?.id?.toString() ?? index.toString()
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.card,
                  {
                    backgroundColor: card,
                  },
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/group/[id]",
                    params: {
                      id: item?.id,
                    },
                  })
                }
              >
                <View style={styles.cardContent}>
                  <View>
                    <Text style={[styles.groupName, { color: text }]}>
                      {item?.groupName}
                    </Text>
                    <Text style={styles.groupSub}>Tap to open group</Text>
                  </View>
                  <Pressable
                    onPress={async () => {
                      setMenuVisible(true);
                      await fetchGroupDetail(item.id);
                    }}
                    style={{ position: "absolute", top: 10, right: 10 }}
                  >
                    <Ionicons name="ellipsis-vertical" size={20} color="#999" />
                  </Pressable>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: primary }]}
          onPress={handleCreateGroup}
        >
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 50,
        }}
      >
        <Pressable
          style={{ padding: 10, backgroundColor: primary, borderRadius: 8 }}
          onPress={handleLogOut}
        >
          <Text style={{ color: text }}>Logout</Text>
        </Pressable>
      </View>

      <Modal visible={showModal} animationType="fade" transparent>
        <View style={styles.modalOverlay2}>
          <View style={[styles.modalContainer, { backgroundColor: modalBg }]}>
            <Text style={[styles.modalTitle, { color: text }]}>
              Choose Action
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: primary }]}
              onPress={() => {
                router.push("/group/creategroup");
                setShowModal(false);
              }}
            >
              <Ionicons name="add-circle-outline" size={20} color="#fff" />
              <Text style={styles.modalButtonText}>Create Group</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#4CAF50" }]}
              onPress={() => {
                router.push("/group/joingroup");
                setShowModal(false);
              }}
            >
              <Ionicons name="log-in-outline" size={20} color="#fff" />
              <Text style={styles.modalButtonText}>Join Group</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.cancelButton2}
            >
              <Text style={styles.cancelText2}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View
            style={[
              styles.menuContainer,
              {
                backgroundColor: card,
              },
            ]}
          >
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);

                router.push({
                  pathname: "/group/[id]",
                  params: {
                    id: Number(selectedGroupDetail?.id),
                  },
                });
              }}
            >
              <Ionicons name="open-outline" size={20} color={text} />

              <Text
                style={[
                  styles.menuText,
                  {
                    color: text,
                  },
                ]}
              >
                Open Group
              </Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() =>
                handleCopyCode(selectedGroupDetail?.inviteCode || "")
              }
            >
              <Ionicons name="copy-outline" size={20} color={text} />

              <Text
                style={[
                  styles.menuText,
                  {
                    color: text,
                  },
                ]}
              >
                Copy Group Code
              </Text>
            </Pressable>

            <View
              style={[
                styles.divider,
                {
                  backgroundColor:
                    mode === "dark" ? "rgba(255,255,255,0.06)" : "#ECECEC",
                },
              ]}
            />
            <Pressable
              style={styles.menuItem}
              onPress={isAdmin ? handleDeleteGroup : handleLeaveGroup}
            >
              {leaveLoading ? (
                <ActivityIndicator size="small" color="#ef4444" />
              ) : (
                <Ionicons
                  name={isAdmin ? "trash-outline" : "exit-outline"}
                  size={20}
                  color="#ef4444"
                />
              )}

              <Text
                style={[
                  styles.menuText,
                  {
                    color: "#ef4444",
                  },
                ]}
              >
                {leaveLoading
                  ? isAdmin
                    ? "Deleting Group..."
                    : "Leaving Group..."
                  : isAdmin
                    ? "Delete Group"
                    : "Leave Group"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => setMenuVisible(false)}
            >
              <Text
                style={[
                  styles.cancelText,
                  {
                    color: text,
                  },
                ]}
              >
                Cancel
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default GroupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
    paddingTop: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  menuContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingBottom: 34,
    paddingHorizontal: 18,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },

  menuText: {
    marginLeft: 14,
    fontSize: 15,
    fontWeight: "500",
  },

  divider: {
    height: 1,
    marginVertical: 6,
  },

  cancelButton: {
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  cancelText: {
    fontSize: 15,
    fontWeight: "600",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loaderText: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "500",
    opacity: 0.7,
  },

  header: {
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 10,
    color: "#444",
  },
  subText: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 20,
    backgroundColor: "#1a73e8",
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 18,
    borderRadius: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  groupName: {
    fontSize: 18,
    fontWeight: "600",
  },

  groupSub: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },

  modalOverlay2: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 8,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },

  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    gap: 8,
  },

  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },

  cancelButton2: {
    marginTop: 10,
  },

  cancelText2: {
    color: "#888",
    fontSize: 14,
  },
});
