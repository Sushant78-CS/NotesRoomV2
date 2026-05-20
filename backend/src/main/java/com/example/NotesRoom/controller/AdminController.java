package com.example.NotesRoom.controller;

import com.example.NotesRoom.dto.*;
import com.example.NotesRoom.entity.FileEntity;
import com.example.NotesRoom.entity.Users;
import com.example.NotesRoom.repository.FileRepository;
import com.example.NotesRoom.repository.UserRepository;
import com.example.NotesRoom.service.AdminService;
import com.example.NotesRoom.service.FileService;
import com.example.NotesRoom.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final FileService fileService;
    private final UserRepository userRepository;
    private final GroupService groupService;
    private final FileRepository fileRepository;

    @PostMapping(
            value = "/file/group/{groupId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<FileResponseDto> uploadFile(@RequestParam("file") MultipartFile file,
                                                      @PathVariable Long groupId,
                                                      @AuthenticationPrincipal Jwt jwt) {
        System.out.println("UPLOAD API HIT");
        FileResponseDto uploadedFile = fileService.uploadFile(file, jwt.getSubject(), groupId);
        FileResponseDto fileResponseDto = new FileResponseDto(
                uploadedFile.getId(), uploadedFile.getFileUrl(), uploadedFile.getFileName(), uploadedFile.getUploadedByUsername()
        );

        return ResponseEntity.ok(uploadedFile);
    }

    @DeleteMapping("/group/{groupId}/files/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long fileId, @PathVariable Long groupId, @AuthenticationPrincipal Jwt jwt) {
        String clerkId = jwt.getSubject();
        boolean deletedFile = fileService.deleteFile(fileId, groupId, clerkId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/files")
    public ResponseEntity<List<FileResponseDto>> getAllFiles(@AuthenticationPrincipal Jwt jwt) {
        String clerkId = jwt.getSubject();
        List<FileResponseDto> allFiles = fileService.getAllFiles(clerkId);

        return ResponseEntity.ok(allFiles);
    }

    @PutMapping("/file/{fileId}")
    public ResponseEntity<FileResponseDto> updateFile(@RequestParam("file") MultipartFile file,
                                                      @PathVariable Long fileId,
                                                      @AuthenticationPrincipal Jwt jwt) {
        String clerkId = jwt.getSubject();
        FileResponseDto fileResponseDto = fileService.updateFile(fileId, file, clerkId);

        return ResponseEntity.ok(fileResponseDto);
    }

    @GetMapping("/group/users/{groupId}")
    public ResponseEntity<List<UserDto>> getAllGroupUsers(@PathVariable Long groupId, @AuthenticationPrincipal Jwt jwt) {
        String clerkId = jwt.getSubject();
        List<UserDto> allGroupUsers = groupService.getAllGroupUsers(clerkId, groupId);

        return ResponseEntity.ok(allGroupUsers);
    }

    @DeleteMapping("/group/{groupId}")
    public ResponseEntity<String> deleteGroup(@PathVariable Long groupId, @AuthenticationPrincipal Jwt jwt) {
        String clerkId = jwt.getSubject();
        groupService.deleteGroup(clerkId, groupId);

        return ResponseEntity.ok("Group deleted successfully");
    }

    @DeleteMapping("/group/{targetUserId}/{groupId}")
    public ResponseEntity<String> deleteGroupUser(@PathVariable Long targetUserId, @AuthenticationPrincipal Jwt jwt, @PathVariable Long groupId) {
        String clerkId = jwt.getSubject();
        groupService.deleteGroupUser(clerkId, targetUserId, groupId);

        return ResponseEntity.ok("User deleted successfully");
    }

    @GetMapping("/group")
    public ResponseEntity<?> getCreatedGroups(@AuthenticationPrincipal Jwt jwt) {
        String clerkId = jwt.getSubject();
        List<AllGroupResponseDto> allCreatedGroup = groupService.getAllCreatedGroup(clerkId);

        return ResponseEntity.ok(allCreatedGroup);
    }

}











