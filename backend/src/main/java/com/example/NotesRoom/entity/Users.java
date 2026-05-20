package com.example.NotesRoom.entity;

import com.example.NotesRoom.dto.type.RoleType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Entity
@ToString(exclude = {"files", "createdGroups", "groups"})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String clerkId;

    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @OneToMany(mappedBy = "uploadedBy")
    @JsonIgnore
    private List<FileEntity> files;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleType role;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<GroupMember> membership = new ArrayList<>();

    @OneToMany(mappedBy = "createdBy")
    @JsonIgnore
    private Set<Group> createdGroups = new HashSet<>();
}
