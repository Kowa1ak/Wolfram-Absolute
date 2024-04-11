package com.stk.wolframabsolute.controller;

import com.stk.wolframabsolute.entity.SigninRequest;
import com.stk.wolframabsolute.entity.User;
import com.stk.wolframabsolute.service.UserDetailsImpService;
import com.stk.wolframabsolute.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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


    @PostMapping("/registration")
    public ResponseEntity<Map<String, String>> addUser(@RequestBody User user) {
        user.setRoles("ROLE_USER");
        userService.addUser(user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Saved user: " + user.toString());
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
