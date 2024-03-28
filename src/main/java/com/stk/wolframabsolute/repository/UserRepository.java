package com.stk.wolframabsolute.repository;

import com.stk.wolframabsolute.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, CrudRepository<User, Long> {
    User findByUsername(String username);
    Boolean existsByEmail(String email);
    Boolean existsByUsername(String username);
}
