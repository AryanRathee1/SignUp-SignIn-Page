package com.aryan.backend.repository;

import com.aryan.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User,Long> {
    User findByUsernameAndPassword(String username, String password);
    List<User> findByUsername(String username);
    User findByEmail(String email);
}
