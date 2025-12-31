package com.fitness.userservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fitness.userservice.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String>{

    boolean existsByEmail(String email);

    boolean existsByKeyCloakId(String userId);

    User findByEmail(String email);
}
