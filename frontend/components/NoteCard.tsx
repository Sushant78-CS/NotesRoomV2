import { darkTheme, lightTheme } from "@/constants/theme";
import { useThemeStore } from "@/store/themeStore";
import { FileType } from "@/types/groupTypes";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NoteCard = ({
  handleDownloadFile,
  handleDeleteConfirm,
  fileDeleteLoading,
  selectedFileId,
  handleShareFile,
  isFileDownloaded,
  downloadingFile,
  groupFiles,
  isAdmin,
  viewFile,
}: {
  groupFiles: FileType[];
  handleDownloadFile: (fileUrl: string, fileName: string) => void;
  handleDeleteConfirm: (fileId: number) => void;
  fileDeleteLoading: boolean;
  selectedFileId: number | null;
  handleShareFile: (fileName: string) => void;
  isFileDownloaded: (fileName: string) => boolean;
  downloadingFile: string | null;
  isAdmin: boolean;
  viewFile: (fileName: string, fileUrl: string) => void;
}) => {
  const mode = useThemeStore((state) => state.theme);
  const theme = mode === "dark" ? darkTheme : lightTheme;

  const { card, modalBg, text, primary } = theme;

  return (
    <SafeAreaView edges={["bottom"]}>
      <FlatList
        data={[...groupFiles].reverse()}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => viewFile(item.fileName, item.fileUrl)}
            style={[
              styles.noteCard,
              {
                backgroundColor: card,
              },
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: modalBg,
                },
              ]}
            >
              <Ionicons
                name="document-text-outline"
                size={22}
                color={primary}
              />
            </View>

            <View style={styles.noteInfo}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.fileName,
                  {
                    color: text,
                  },
                ]}
              >
                {item.fileName}
              </Text>

              <Text
                numberOfLines={1}
                style={[
                  styles.uploadInfo,
                  {
                    color: text,
                    opacity: 0.55,
                  },
                ]}
              >
                Uploaded by {item.uploadedByUsername}
              </Text>

              <View style={styles.bottomRow}>
                <View style={styles.leftSection}>
                  {!isFileDownloaded(item.fileName) && (
                    <Pressable
                      onPress={(event) => {
                        event.stopPropagation();

                        handleDownloadFile(item.fileUrl, item.fileName);
                      }}
                      style={[
                        styles.downloadButton,
                        {
                          backgroundColor: modalBg,
                        },
                      ]}
                    >
                      {downloadingFile === item.fileName ? (
                        <>
                          <ActivityIndicator color={text} size="small" />

                          <Text
                            style={[
                              styles.downloadText,
                              {
                                color: text,
                              },
                            ]}
                          >
                            Downloading...
                          </Text>
                        </>
                      ) : (
                        <>
                          <Ionicons
                            name="download-outline"
                            size={17}
                            color={text}
                          />

                          <Text
                            style={[
                              styles.downloadText,
                              {
                                color: text,
                              },
                            ]}
                          >
                            Download
                          </Text>
                        </>
                      )}
                    </Pressable>
                  )}
                </View>

                {isFileDownloaded(item.fileName) && (
                  <View style={styles.actionButtons}>
                    <Pressable
                      onPress={(event) => {
                        event.stopPropagation();

                        handleShareFile(item.fileName);
                      }}
                      style={styles.actionButton}
                    >
                      <Ionicons
                        name="share-social-outline"
                        size={18}
                        color={text}
                      />
                    </Pressable>
                  </View>
                )}
                <View>
                  {isAdmin && (
                    <Pressable
                      onPress={(event) => {
                        event.stopPropagation();

                        handleDeleteConfirm(item.id);
                      }}
                      style={styles.actionButton}
                    >
                      {fileDeleteLoading && item.id === selectedFileId ? (
                        <ActivityIndicator size="small" color={text} />
                      ) : (
                        <Ionicons name="trash-outline" size={18} color={text} />
                      )}
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default NoteCard;

const styles = StyleSheet.create({
  noteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 22,
    marginBottom: 14,
    marginHorizontal: 12,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  noteInfo: {
    flex: 1,
    marginLeft: 14,
  },

  fileName: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
  },

  uploadInfo: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },

  bottomRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftSection: {
    flex: 1,
  },

  downloadButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 10,
    paddingHorizontal: 14,

    borderRadius: 14,
  },

  downloadText: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: "600",
  },

  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },

  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    marginLeft: 8,
  },

  downloadedContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
  },

  downloadedText: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: "600",
  },

  downloadContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
