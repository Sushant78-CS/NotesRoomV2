package com.example.NotesRoom.service;

import com.example.NotesRoom.dto.*;
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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final FileRepository fileRepository;
    private final GroupMemberRepository groupMemberRepository;

    @Transactional
    public GroupResponseDto createGroup(String clerkId, String groupName) {
        try {
            Users creatorUser = userRepository.findByClerkId(clerkId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Group group = Group.builder()
                    .createdBy(creatorUser)
                    .name(groupName)
                    .inviteCode((UUID.randomUUID().toString().substring(0, 6)))
                    .build();
            groupRepository.save(group);

            GroupMember member = new GroupMember();
            member.setUser(creatorUser);
            member.setGroup(group);
            member.setRole(RoleType.ROLE_ADMIN);

            groupMemberRepository.save(member);
            return new GroupResponseDto(group.getName(), group.getCreatedBy().getId(), group.getCreatedBy().getUsername(), group.getInviteCode());
        } catch (Exception e) {
            throw new RuntimeException("Error createGroup", e);
        }
    }

    public JoinGroupResponseDto joinGroups(String clerkId, String inviteCode) {
        Users joinUser = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Group group = groupRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (groupMemberRepository.existsByUserAndGroup(joinUser, group)) {
            throw new RuntimeException("User already joined this group");
        }

        GroupMember member = new GroupMember();
        member.setUser(joinUser);
        member.setGroup(group);
        member.setRole(RoleType.ROLE_USER);

        groupMemberRepository.save(member);

        return new JoinGroupResponseDto(member.getGroup().getName(), member.getUser().getUsername(), member.getGroup().getId());
    }

    public List<UserDto> getAllGroupUsers(String clerkId, Long groupId) {
        Users user = userRepository.findByClerkId(clerkId).orElseThrow(() -> new RuntimeException("User not fond"));

        GroupMember memberShip = groupMemberRepository.findByUser_IdAndGroup_Id(user.getId(), groupId)
                .orElseThrow(() -> new RuntimeException("Access denied: Not a group member"));

        if (memberShip.getRole() != RoleType.ROLE_ADMIN) {
            throw new RuntimeException("Access denied: Only admin can view users");
        }

        List<GroupMember> members = groupMemberRepository.findByGroup_Id(groupId);


        return members.stream().map(member -> new UserDto(
                member.getUser().getId(), member.getUser().getUsername(), member.getRole()
        )).toList();
    }

    public void deleteGroup(String clerkId, Long groupId) {
        Users user = userRepository.findByClerkId(clerkId).orElseThrow(() -> new RuntimeException("User not found"));
        GroupMember admin = groupMemberRepository.findByUser_IdAndGroup_Id(user.getId(), groupId)
                .orElseThrow(() -> new RuntimeException("Not a group member"));

        if (admin.getRole() != RoleType.ROLE_ADMIN) {
            throw new RuntimeException("Only admin can delete the group");
        }

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (!group.getCreatedBy().getId().equals(user.getId())) {
            throw new RuntimeException("Only the creator can delete this group");
        }

        groupRepository.delete(group);
    }

    public void deleteGroupUser(String clerkId, Long targetUserId, Long groupId) {
        Users user = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new RuntimeException("user not found"));
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        if (!group.getCreatedBy().getId().equals(user.getId())) {
            throw new RuntimeException("Only creator can remove users");
        }
        GroupMember targetUser = groupMemberRepository.findByUser_IdAndGroup_Id(targetUserId, groupId)
                .orElseThrow(() -> new RuntimeException("User not in group"));
        if (targetUser.getUser().getId().equals(group.getCreatedBy().getId())) {
            throw new RuntimeException("Cannot remove group creator");
        }
        groupMemberRepository.delete(targetUser);
    }

    public void leaveGroup(String clerkId, Long groupId) {
        Users user = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new RuntimeException("user not found"));
        GroupMember member = groupMemberRepository.findByUser_IdAndGroup_Id(user.getId(), groupId)
                .orElseThrow(() -> new RuntimeException("Not a group member"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (member.getUser().getId().equals(group.getCreatedBy().getId())) {
            throw new RuntimeException("Group creator can't leave");
        }

        groupMemberRepository.delete(member);

    }

    public List<AllGroupResponseDto> getAllGroup(String clerkId) {
        Users user = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new RuntimeException("user not found"));
        List<GroupMember> memberships = groupMemberRepository.findByUser_Id(user.getId());

        return memberships.stream().map(group -> {
            Group allGroup = group.getGroup();
            return new AllGroupResponseDto(allGroup.getId(), allGroup.getName());
        }).toList();
    }

    @Transactional(readOnly = true)
    public List<AllGroupResponseDto> getAllJoinedGroup(String clerkId) {
        Users user = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new RuntimeException("user not found"));
        return groupMemberRepository.findGroupDtosByUserIdAndRole(user.getId(), RoleType.ROLE_USER);
    }

    @Transactional(readOnly = true)
    public List<AllGroupResponseDto> getAllCreatedGroup(String clerkId) {
        Users user = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new RuntimeException("user not found"));
        return groupMemberRepository.findGroupDtosByUserIdAndRole(user.getId(), RoleType.ROLE_ADMIN);
    }

    public GroupDetailDto getGroupDetail(Long groupId, String clerkId) {
        Users user = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new RuntimeException("user not found"));
        GroupMember member1 = groupMemberRepository.findByUser_IdAndGroup_Id(user.getId(), groupId)
                .orElseThrow(() -> new RuntimeException("Access denied"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        Integer memberCount = groupMemberRepository.countByGroup_Id(groupId);

        return new GroupDetailDto(
                group.getId(),
                group.getName(),
                group.getInviteCode(),
                group.getCreatedBy().getId(),
                group.getCreatedBy().getUsername(),
                memberCount
        );
    }

    public List<MemberResponseDto> getMembers(String clerkId, Long groupId) throws AccessDeniedException {
        Users user = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new RuntimeException("user not found"));
        boolean isMember = groupMemberRepository.existsByUser_IdAndGroup_Id(user.getId(), groupId);

        if (!isMember) {
            throw new AccessDeniedException("Access denied");
        }

        List<GroupMember> members = groupMemberRepository.findByGroup_Id(groupId);

        return members.stream().map(member ->
                new MemberResponseDto(member.getUser().getId(), member.getUser().getClerkId(), member.getUser().getUsername(), member.getRole())
        ).toList();
    }

    public GroupFilesResponseDto getFiles(String clerkId, Long groupId) {
        Users user = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new RuntimeException("user not found"));
        GroupMember member = groupMemberRepository.findByUser_IdAndGroup_Id(user.getId(), groupId)
                .orElseThrow(() -> new AccessDeniedException("Access denied"));

        List<FileEntity> files = fileRepository.findByGroup_Id(groupId);

        List<FileResponseDto> list = files.stream().map(file ->
                new FileResponseDto(file.getId(), file.getFileUrl(), file.getFileName(), file.getUploadedBy().getUsername())
        ).toList();

        boolean isAdmin = member.getRole() == RoleType.ROLE_ADMIN;

        return new GroupFilesResponseDto(list, isAdmin);
    }
}

















