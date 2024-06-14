package com.stk.wolframabsolute.controller;

import com.stk.wolframabsolute.chat.ChatController;
import com.stk.wolframabsolute.chat.ChatMessage;
import com.stk.wolframabsolute.requests.SigninRequest;
import com.stk.wolframabsolute.entity.User;
import com.stk.wolframabsolute.service.EmailService;
import com.stk.wolframabsolute.service.UserDetailsImpService;
import com.stk.wolframabsolute.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/wolfram")
@AllArgsConstructor
public class UserController {

    private static final Logger logger = LogManager.getLogger(UserController.class);
    private UserService userService;
    private UserDetailsImpService userDetailsImpService;
    private PasswordEncoder passwordEncoder;
    private ChatController chatController;

    @Autowired
    EmailService emailService;
    @PostMapping("/registration")
    public ResponseEntity<Map<String, String>> addUser(@RequestBody User user) {
        logger.info("Starting user registration for email: {}", user.getEmail());
        user.setRoles("ROLE_USER");
        userService.addUser(user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Saved user: " + user.toString());

        emailService.sendSimpleEmail(user.getEmail(), "Welcome", "This is a welcome email for your!!");

        logger.info("User registered and welcome email sent to: {}", user.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody SigninRequest signinRequest) {
        logger.info("Attempting to log in user with email: {}", signinRequest.getEmail());
        Map<String, String> response = new HashMap<>();
        if (userService.authenticateUser(signinRequest.getEmail(), signinRequest.getPassword())) {
            User user = userService.getUserByEmail(signinRequest.getEmail());
            response.put("message", "User logged in successfully");
            response.put("username", user.getUsername());
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "Invalid credentials");
            logger.warn("Invalid login attempt for email: {}", signinRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PutMapping("/changePassword")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody SigninRequest signinRequest) {
        logger.info("Attempting to change password for email: {}", signinRequest.getEmail());
        User user = userService.getUserByEmail(signinRequest.getEmail());
        if (user != null) {

            user.setPassword(signinRequest.getPassword()); // Установите исходный пароль

            userService.updateUserPassword(user);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully for user: " + user.getUsername());
            logger.info("message", "Password changed successfully for user: " + user.getUsername());
            return ResponseEntity.ok(response);
        } else {
            // Пользователь не найден
            Map<String, String> response = new HashMap<>();
            response.put("error", "User not found");
            logger.info("error", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }


    @GetMapping("/users")
    public ResponseEntity<User> getUserByEmail(@RequestParam String email) {
        User user = userService.getUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

}
