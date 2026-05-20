package com.example.NotesRoom.repository;

import com.example.NotesRoom.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
    Users findByUsername(String username);

    Optional<Users> findByClerkId(String clerkId);
}
