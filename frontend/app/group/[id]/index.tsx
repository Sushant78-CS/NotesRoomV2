import { deleteFile, uploadFile } from "@/api/admin";
import { getFilesInGroup } from "@/api/user";
import NoteCard from "@/components/NoteCard";
import { darkTheme, lightTheme } from "@/constants/theme";
import { useThemeStore } from "@/store/themeStore";
import { FileType } from "@/types/groupTypes";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { Directory, File, Paths } from "expo-file-system";
import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const NotesPage = () => {
  const mode = useThemeStore((s) => s.theme);
  const { background, text, card, primary, modalBg } =
    mode === "dark" ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();

  const [groupFiles, setGroupFiles] = useState<FileType[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [fileDeleteLoading, setFileDeleteLoading] = useState<boolean>(false);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  const { id: groupId } = useLocalSearchParams();

  const viewFile = async (fileName: string, fileUrl: string) => {
    try {
      const file = getLocalFile(fileName);
      if (!file.exists) {
        await handleDownloadFile(fileUrl, fileName);
      }
      const contentUri = await FileSystem.getContentUriAsync(file.uri);
      await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: contentUri,
        flags: 1,
        type: "*/*",
      });
    } catch (e) {
      Alert.alert("Something went wrong!");
    }
  };

  const getLocalFile = (fileName: string) => {
    const downloadedDir = new Directory(Paths.cache, "downloads");
    downloadedDir.create({ idempotent: true });
    return new File(downloadedDir, fileName);
  };

  const handleDownloadFile = async (fileUrl: string, fileName: string) => {
    try {
      setDownloadingFile(fileName);
      const file = getLocalFile(fileName);
      await File.downloadFileAsync(fileUrl, file);
    } catch (error) {
      Alert.alert("Something went wrong!");
    } finally {
      setDownloadingFile(null);
    }
  };

  const handleShareFile = async (fileName: string) => {
    try {
      const downloadedFile = getLocalFile(fileName);
      if (!downloadedFile.exists) {
        Alert.alert(
          "File Not Downloaded",
          "Please download the file before sharing.",
        );
        return;
      }
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(downloadedFile.uri, {
          dialogTitle: fileName,
        });
      }
    } catch (error) {
      Alert.alert("Something went wrong!");
    }
  };

  const isFileDownloaded = (fileName: string) => {
    const file = getLocalFile(fileName);
    return file.exists;
  };

  useEffect(() => {
    fetchGroupFiles(Number(groupId));
  }, []);

  const fetchGroupFiles = async (groupId: number) => {
    try {
      setLoading(true);
      const res = await getFilesInGroup(groupId);
      setIsAdmin(res.data.admin);
      setGroupFiles(res.data.files);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileDelete = async (fileId: number) => {
    const previousFiles = groupFiles;
    try {
      setFileDeleteLoading(true);
      await deleteFile(fileId, Number(groupId));
      setGroupFiles((prev) => prev?.filter((f) => f?.id !== fileId));
    } catch (error: any) {
      setGroupFiles(previousFiles);
      console.log(error.response.data);
    } finally {
      setFileDeleteLoading(false);
    }
  };

  const handleDeleteConfirm = (fileId: number) => {
    setSelectedFileId(fileId);
    setDeleteModalVisible(true);
  };

  const handleUploadFile = async (file: any) => {
    if (!file) {
      console.log("No file selected");
      return;
    }
    const previousFiles = groupFiles;
    try {
      setUploadingFile(true);
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: file.mimeType || "application/octet-stream",
        name: file.name || `file_${Date.now()}`,
      } as any);
      const res = await uploadFile(formData, Number(groupId));
      setGroupFiles((prev) => {
        if (!prev) return [res?.data];
        return [...prev, res?.data];
      });
    } catch (error: any) {
      setGroupFiles(previousFiles);
      console.log("FULL ERROR", error);
    } finally {
      setUploadingFile(false);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      multiple: false,
      copyToCacheDirectory: true,
    });
    console.log("PICKER RESULT =>", result);
    if (!result.canceled) {
      const file = result.assets?.[0];
      console.log("ASSET =>", file);
      await handleUploadFile(file);
    }
  };

  if (uploadingFile) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: background,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          },
        ]}
      >
        <View
          style={{
            width: "100%",
            alignItems: "center",
            paddingVertical: 32,
          }}
        >
          <ActivityIndicator size="large" color={primary} />
          <Text
            style={{
              color: text,
              fontSize: 20,
              fontWeight: "600",
              marginTop: 24,
            }}
          >
            Uploading file
          </Text>
          <Text
            style={{
              color: text,
              opacity: 0.6,
              fontSize: 14,
              textAlign: "center",
              marginTop: 10,
              lineHeight: 22,
              maxWidth: 280,
            }}
          >
            Please keep the app open while your file is being uploaded.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{
        flex: 1,
        backgroundColor: background,
      }}
    >
      <View style={[styles.container, { marginBottom: insets.bottom + 10 }]}>
        <View style={[styles.headerContainer, {}]}>
          <View
            style={[
              styles.bannerCard,
              {
                backgroundColor: primary,
              },
            ]}
          >
            <View style={styles.bannerOverlay} />

            <View style={styles.bannerContent}>
              <View>
                <Text style={styles.classTitle}>Shared Notes</Text>

                <Text style={styles.classSubtitle}>files & resources</Text>
              </View>

              <View
                style={[
                  styles.fileCountContainer,
                  {
                    backgroundColor: "rgba(255,255,255,0.18)",
                  },
                ]}
              >
                <Text style={styles.fileCountText}>{groupFiles.length}</Text>
              </View>
            </View>
          </View>
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
              Loading files...
            </Text>
          </View>
        ) : groupFiles?.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyTitle,
                {
                  color: text,
                },
              ]}
            >
              No shared files
            </Text>

            <Text
              style={[
                styles.emptySubtitle,
                {
                  color: text,
                  opacity: 0.6,
                },
              ]}
            >
              Uploaded files will appear here
            </Text>
          </View>
        ) : (
          <NoteCard
            groupFiles={groupFiles}
            handleDeleteConfirm={handleDeleteConfirm}
            fileDeleteLoading={fileDeleteLoading}
            selectedFileId={selectedFileId}
            handleShareFile={handleShareFile}
            isFileDownloaded={isFileDownloaded}
            downloadingFile={downloadingFile}
            handleDownloadFile={handleDownloadFile}
            isAdmin={isAdmin}
            viewFile={viewFile}
          />
        )}

        {isAdmin && (
          <Pressable
            onPress={pickDocument}
            style={[
              styles.fabButton,
              {
                backgroundColor: primary,
              },
            ]}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </Pressable>
        )}

        <Modal transparent visible={deleteModalVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: card,
                },
              ]}
            >
              <Text style={[styles.modalTitle, { color: text }]}>
                Delete file?
              </Text>
              <Text
                style={[
                  styles.modalDescription,
                  {
                    color: text,
                    opacity: 0.7,
                  },
                ]}
              >
                This file will be permanently deleted and cannot be recovered.
              </Text>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => setDeleteModalVisible(false)}
                  style={styles.cancelButton}
                >
                  <Text
                    style={[
                      styles.cancelButtonText,
                      {
                        color: text,
                      },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (selectedFileId) {
                      handleFileDelete(selectedFileId);
                    }

                    setDeleteModalVisible(false);
                  }}
                  style={styles.deleteConfirmButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default NotesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 16,
  },

  headerContainer: {
    marginBottom: 16,
  },

  bannerCard: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
    padding: 22,
    minHeight: 150,
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  bannerOverlay: {
    position: "absolute",
    top: -40,
    right: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  bannerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  classTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  classSubtitle: {
    marginTop: 8,
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    lineHeight: 20,
  },

  fileCountContainer: {
    minWidth: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  fileCountText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  bannerBottom: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 26,
  },

  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 18,
    marginRight: 12,
  },

  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },

  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 18,
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

  secondaryButtonText: {
    color: "#dbeafe",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },

  header: {
    marginTop: 8,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heading: {
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  subHeading: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },

  headerBadge: {
    minWidth: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  headerBadgeText: {
    fontSize: 15,
    fontWeight: "700",
  },

  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 26,
    right: 22,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
  },

  emptyIconContainer: {
    width: 82,
    height: 82,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  modalContainer: {
    width: "100%",
    borderRadius: 20,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  modalDescription: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
  },

  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },

  deleteConfirmButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginLeft: 10,
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },

  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
