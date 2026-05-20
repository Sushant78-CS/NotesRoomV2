import { getGroupDetail, getMembersInGroup } from "@/api/user";
import { darkTheme, lightTheme } from "@/constants/theme";
import { useThemeStore } from "@/store/themeStore";
import { GroupDetail, GroupMember } from "@/types/groupTypes";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";

const GroupDetailPage = () => {
  const mode = useThemeStore((s) => s.theme);
  const { background, text, card, primary, modalBg } =
    mode === "dark" ? darkTheme : lightTheme;
  const { id: groupId } = useLocalSearchParams();
  const { user } = useUser();
  console.log("current user id : ", user?.id);

  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [groupDetail, setGroupDetail] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const currentUserId = user?.id;
  const isAdmin = groupMembers.some(
    (member) =>
      member.clerkId === currentUserId && member.role === "ROLE_ADMIN",
  );
  console.log("isAdmin", isAdmin);

  useEffect(() => {
    console.log("groupId", groupId);
    fetchGroupMembers(Number(groupId));
    fetchGroupDetail(Number(groupId));
  }, []);

  const fetchGroupMembers = async (groupId: number) => {
    try {
      setLoading(true);

      const res = await getMembersInGroup(groupId);

      setGroupMembers(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupDetail = async (groupId: number) => {
    try {
      setLoading(true);

      const res = await getGroupDetail(groupId);

      setGroupDetail(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(groupDetail?.inviteCode || "");
    ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
  };

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[
        styles.container,
        {
          backgroundColor: background,
        },
      ]}
    >
      <View
        style={[
          styles.headerCard,
          {
            backgroundColor: primary,
          },
        ]}
      >
        <View style={styles.headerOverlay} />

        <View style={styles.headerContent}>
          <View>
            <Text style={styles.pageTitle}>Members</Text>
            <Text style={styles.pageSubtitle}>
              {isAdmin ? "Manage and view group members" : "View group members"}
            </Text>
            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Group Code</Text>

              <View
                style={[
                  styles.codeBox,
                  {
                    backgroundColor: modalBg,
                  },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color={text} size="small" />
                ) : groupDetail?.inviteCode ? (
                  <Text style={[styles.codeText, { color: text }]}>
                    {groupDetail?.inviteCode}
                  </Text>
                ) : (
                  <Text style={[styles.codeText, { color: text }]}>N/A</Text>
                )}

                {!loading && groupDetail?.inviteCode && (
                  <Pressable onPress={handleCopyCode} style={styles.copyButton}>
                    <Ionicons name="copy-outline" size={18} color={text} />
                  </Pressable>
                )}
              </View>
            </View>
          </View>

          <View style={styles.memberCountBadge}>
            <Text style={styles.memberCountText}>
              {groupDetail?.memberCount || 0}
            </Text>
          </View>
        </View>
      </View>

      {groupMembers
        ?.filter((member) => member.role === "ROLE_ADMIN")
        .map((admin) => (
          <View
            key={admin.id}
            style={[
              styles.adminCard,
              {
                backgroundColor: card,
              },
            ]}
          >
            <View
              style={[
                styles.adminAvatar,
                {
                  backgroundColor: primary,
                },
              ]}
            >
              <Text style={styles.adminAvatarText}>
                {admin?.username?.charAt(0)?.toUpperCase()}
              </Text>
            </View>

            <View style={styles.adminInfo}>
              <Text
                style={[
                  styles.adminName,
                  {
                    color: text,
                  },
                ]}
              >
                {admin?.username}
              </Text>

              <View style={[styles.adminBadge, { backgroundColor: primary }]}>
                <Text style={styles.adminBadgeText}>Admin</Text>
              </View>
            </View>
          </View>
        ))}

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={groupMembers?.filter((member) => member.role !== "ROLE_ADMIN")}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30,
          }}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.memberCard,
                {
                  backgroundColor: card,
                },
              ]}
            >
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: mode === "dark" ? "#252525" : "#F3F4F6",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.avatarText,
                    {
                      color: text,
                    },
                  ]}
                >
                  {item?.username?.charAt(0)?.toUpperCase()}
                </Text>
              </View>

              <View style={styles.memberInfo}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.memberName,
                    {
                      color: text,
                    },
                  ]}
                >
                  {item?.username}
                </Text>

                <Text
                  style={[
                    styles.memberRole,
                    {
                      color: text,
                      opacity: 0.5,
                    },
                  ]}
                >
                  Member
                </Text>
              </View>

              <View
                style={[
                  styles.memberIndexBadge,
                  {
                    backgroundColor: mode === "dark" ? "#202020" : "#F5F5F5",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.memberIndexText,
                    {
                      color: text,
                    },
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default GroupDetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  codeContainer: {
    marginTop: moderateScale(12, 0.3),
  },

  codeLabel: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
    marginBottom: moderateScale(8, 0.3),
    letterSpacing: 0.3,
  },

  codeBox: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    paddingVertical: 4,
    gap: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  codeText: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  copyButton: {
    width: moderateScale(32, 0.3),
    height: moderateScale(32, 0.3),
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  headerCard: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
    padding: moderateScale(22, 0.3),
    marginBottom: moderateScale(22, 0.3),

    shadowColor: "#000",
    shadowOffset: {
      width: moderateScale(0, 0.3),
      height: moderateScale(6, 0.3),
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },

  headerOverlay: {
    position: "absolute",
    top: -40,
    right: -20,
    width: moderateScale(160, 0.3),
    height: moderateScale(160, 0.3),
    borderRadius: moderateScale(80, 0.3),
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  pageTitle: {
    color: "#fff",
    fontSize: moderateScale(30, 0.3),
    fontWeight: "700",
  },

  pageSubtitle: {
    marginTop: moderateScale(6, 0.3),
    color: "rgba(255,255,255,0.82)",
    fontSize: moderateScale(14, 0.3),
    lineHeight: moderateScale(20, 0.3),
  },

  memberCountBadge: {
    minWidth: moderateScale(54, 0.3),
    height: moderateScale(54, 0.3),
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.16)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(14, 0.3),
  },

  memberCountText: {
    color: "#fff",
    fontSize: moderateScale(18, 0.3),
    fontWeight: "700",
  },

  adminCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(18, 0.3),
    borderRadius: moderateScale(22, 0.3),
    marginBottom: moderateScale(18, 0.3),

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginHorizontal: 12,
  },

  adminAvatar: {
    width: moderateScale(62, 0.3),
    height: moderateScale(62, 0.3),
    borderRadius: moderateScale(22, 0.3),
    justifyContent: "center",
    alignItems: "center",
  },

  adminAvatarText: {
    fontSize: moderateScale(24, 0.3),
    fontWeight: "700",
    color: "#fff",
  },

  adminInfo: {
    flex: 1,
    marginLeft: moderateScale(16, 0.3),
  },

  adminName: {
    fontSize: moderateScale(17, 0.3),
    fontWeight: "700",
  },

  adminBadge: {
    marginTop: moderateScale(8, 0.3),
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(5, 0.3),
    paddingHorizontal: moderateScale(12, 0.3),
    borderRadius: 12,
    textAlign: "center",
  },

  adminBadgeText: {
    color: "#fff",
    fontSize: moderateScale(12, 0.3),
    fontWeight: "600",
  },

  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(16, 0.3),
    borderRadius: 20,
    marginBottom: moderateScale(14, 0.3),
    marginHorizontal: moderateScale(18, 0.3),
  },

  avatar: {
    width: moderateScale(54, 0.3),
    height: moderateScale(54, 0.3),
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: "700",
  },

  memberInfo: {
    flex: 1,
    marginLeft: moderateScale(14, 0.3),
  },

  memberName: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: "600",
  },

  memberRole: {
    marginTop: moderateScale(4, 0.3),
    fontSize: moderateScale(13, 0.3),
  },

  memberIndexBadge: {
    minWidth: moderateScale(36, 0.3),
    height: moderateScale(36, 0.3),
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  memberIndexText: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: "700",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  topSection: {
    marginTop: moderateScale(14, 0.3),
    marginBottom: moderateScale(28, 0.3),
  },

  memberCount: {
    marginTop: moderateScale(6, 0.3),
    fontSize: moderateScale(14, 0.3),
    fontWeight: "400",
  },

  adminLabel: {
    marginTop: moderateScale(4, 0.3),
    fontSize: moderateScale(13, 0.3),
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});
