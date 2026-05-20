package com.example.NotesRoom.dto;

import com.example.NotesRoom.dto.type.RoleType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MemberResponseDto {
    private Long id;
    private String clerkId;
    private String username;
    private RoleType role;
}
