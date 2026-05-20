package com.example.NotesRoom.service;

import com.cloudinary.Cloudinary;
import com.example.NotesRoom.config.CloudinaryConfig;
import com.example.NotesRoom.dto.FileResponseDto;
import com.example.NotesRoom.dto.type.RoleType;
import com.example.NotesRoom.entity.FileEntity;
import com.example.NotesRoom.entity.Group;
import com.example.NotesRoom.entity.GroupMember;
import com.example.NotesRoom.entity.Users;
import com.example.NotesRoom.repository.FileRepository;
import com.example.NotesRoom.repository.GroupMemberRepository;
import com.example.NotesRoom.repository.GroupRepository;
import com.example.NotesRoom.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {

    private final UserRepository userRepository;
    private final Cloudinary cloudinary;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final FileRepository fileRepository;

    public FileResponseDto uploadFile(MultipartFile file, String clerkId, Long groupId) {
        System.out.println("UPLOAD API HIT OUTSIDE");
        try {
            System.out.println("UPLOAD API HIT INSIDE TRY");
            if (file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }

            String originalFileName = file.getOriginalFilename();
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of("folder", "notes-room",
                            "resource_type", "auto",
                            "type", "upload",
                            "use_filename", true,
                            "unique_filename", true,
                            "filename_override", originalFileName,
                            "access_mode", "public"
                    )
            );
            String publicId = uploadResult.get("public_id").toString();
            if (publicId == null) {
                throw new RuntimeException("Cloudinary did not return publicId");
            }

            String fileUrl = uploadResult.get("secure_url").toString();
            Users users = userRepository.findByClerkId(clerkId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Group group = groupRepository.findById(groupId)
                    .orElseThrow(() -> new RuntimeException("Group not found"));
            FileEntity fileEntity = FileEntity.builder()
                    .fileUrl(fileUrl)
                    .uploadedBy(users)
                    .publicId(publicId)
                    .fileName(originalFileName)
                    .group(group)
                    .build();
            fileRepository.save(fileEntity);
            return new FileResponseDto(fileEntity.getId(), fileEntity.getFileUrl(), fileEntity.getFileName(), fileEntity.getUploadedBy().getUsername());
        } catch (Exception e) {
            log.error("UPLOAD ERROR", e);
            throw new RuntimeException("File upload failed");
        }
    }

    public String getFileUrl(Long fileId) {
        FileEntity file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        return file.getFileUrl();
    }

    public Boolean deleteFile(Long fileId, Long groupId, String clerkId) {
        try {
            Users user = userRepository.findByClerkId(clerkId)
                    .orElseThrow(() -> new RuntimeException("user not found"));
            GroupMember member = groupMemberRepository.findByUser_IdAndGroup_Id(user.getId(), groupId)
                    .orElseThrow(() -> new AccessDeniedException("Access denied"));

            if (member.getRole() != RoleType.ROLE_ADMIN) {
                throw new AccessDeniedException("Only admins can delete files");
            }

            FileEntity file = Optional.ofNullable(
                    fileRepository.findByIdAndGroup_Id(fileId, groupId)
            ).orElseThrow(() ->
                    new RuntimeException("File not found"));

            if (file.getPublicId() != null && !file.getPublicId().isBlank()) {
                Map destroy = cloudinary.uploader().destroy(
                        file.getPublicId(),
                        Map.of("resource_type", "raw")
                );
                System.out.println(destroy);
            }
            fileRepository.delete(file);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(
                    "File delete failed: " + e.getMessage(),
                    e
            );
        }
    }

    public List<FileResponseDto> getAllFiles(String clerkId) {
        Users user = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new RuntimeException("user not found"));
        List<FileEntity> files = fileRepository.findByUploadedById(user.getId());
        return files.stream().map((file) -> (
                new FileResponseDto(
                        file.getId(), file.getFileUrl(), file.getFileName(), file.getUploadedBy().getUsername()
                )
        )).toList();
    }

    public FileResponseDto updateFile(Long fileId, MultipartFile newfile, String clerkId) {
        try {
            Users user = userRepository.findByClerkId(clerkId)
                    .orElseThrow(() -> new RuntimeException("user not found"));
            FileEntity file = fileRepository.findById(fileId).orElseThrow(() -> new RuntimeException("File not found"));
            String oldPublicId = file.getPublicId();
            if (newfile.isEmpty()) {
                throw new RuntimeException("File is empty");
            }
            if (!file.getUploadedBy().getId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized User");
            }
            Map upload = cloudinary.uploader().upload(
                    newfile.getBytes(), Map.of("folder", "notes-room",
                            "resource_type", "raw",
                            "type", "upload")
            );
            String publicId = upload.get("public_id").toString();
            String fileUrl = cloudinary.url().resourceType("raw").generate(publicId);

            if (fileUrl == null || publicId == null) {
                throw new RuntimeException("Cloudinary did not return publicId");
            }

            file.setFileUrl(fileUrl);
            file.setPublicId(publicId);

            fileRepository.save(file);

            try {
                cloudinary.uploader().destroy(oldPublicId, Map.of());
            } catch (Exception e) {
                throw new RuntimeException("File not deleted", e);
            }

            return new FileResponseDto(file.getId(), fileUrl, file.getFileName(), file.getUploadedBy().getUsername());
        } catch (Exception e) {
            throw new RuntimeException("Error updateFile", e);
        }
    }
}
