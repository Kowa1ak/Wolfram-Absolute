package com.stk.wolframabsolute.service;

import com.stk.wolframabsolute.entity.User;
import com.stk.wolframabsolute.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {
    private UserRepository repository;
    private PasswordEncoder passwordEncoder;

    public void addUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        repository.save(user);
    }

    public void updateUserPassword(User user) {
        Optional<User> optionalUser = repository.findByEmail(user.getEmail());
        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();
            existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
            repository.save(existingUser);
        }
    }

    public User getUserByEmail(String email) {
        Optional<User> optionalUser = repository.findByEmail(email);
        // Check if user is present
        if (optionalUser.isPresent()) {
            return optionalUser.get();
        }
        // User not found
        return null;
    }


    public boolean authenticateUser(String email, String password) {
        Optional<User> optionalUser = repository.findByEmail(email);

        // Check if user is present
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            return passwordEncoder.matches(password, user.getPassword());
        }

        // User not found
        return false;
    }

}
