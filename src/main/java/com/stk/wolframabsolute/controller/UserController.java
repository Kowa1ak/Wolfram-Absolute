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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/wolfram")
@AllArgsConstructor
public class UserController {

    private UserService userService;
    private UserDetailsImpService userDetailsImpService;
    private PasswordEncoder passwordEncoder;
    private ChatController chatController;

    @Autowired
    EmailService emailService;
    @PostMapping("/registration")
    public ResponseEntity<Map<String, String>> addUser(@RequestBody User user) {
        user.setRoles("ROLE_USER");
        userService.addUser(user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Saved user: " + user.toString());

        emailService.sendSimpleEmail(user.getEmail(), "Welcome", "This is a welcome email for your!!");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody SigninRequest signinRequest) {
        Map<String, String> response = new HashMap<>();
        if (userService.authenticateUser(signinRequest.getEmail(), signinRequest.getPassword())) {
            User user = userService.getUserByEmail(signinRequest.getEmail());
            response.put("message", "User logged in successfully");
            response.put("username", user.getUsername());
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PutMapping("/changePassword")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody SigninRequest signinRequest) {
        User user = userService.getUserByEmail(signinRequest.getEmail());
        if (user != null) {

            user.setPassword(signinRequest.getPassword()); // Установите исходный пароль

            userService.updateUserPassword(user);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully for user: " + user.getUsername());
            return ResponseEntity.ok(response);
        } else {
            // Пользователь не найден
            Map<String, String> response = new HashMap<>();
            response.put("error", "User not found");
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
