package com.example.NotesRoom.service;

import com.example.NotesRoom.dto.SyncUserDto;
import com.example.NotesRoom.dto.type.RoleType;
import com.example.NotesRoom.entity.Users;
import com.example.NotesRoom.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void syncUser(
            String clerkId,
            SyncUserDto dto
    ) {
        Optional<Users> existingUser = userRepository.findByClerkId(clerkId);

        if (existingUser.isPresent()) {
            return;
        }

        Users user = Users.builder()
                .clerkId(clerkId)
                .username(dto.getUsername())
                .role(RoleType.ROLE_USER)
                .email(dto.getEmail())
                .build();
        userRepository.save(user);
    }

}
