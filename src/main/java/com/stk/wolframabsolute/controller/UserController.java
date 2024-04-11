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


@RestController
@RequestMapping("/wolfram")
@AllArgsConstructor
public class UserController {

    private UserService userService;
    private UserDetailsImpService userDetailsImpService;
    private PasswordEncoder passwordEncoder;


    @PostMapping("/registration")
    public String addUser(@RequestBody User user) {
        userService.addUser(user);
        return "Saved user: " + user.toString();
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody SigninRequest signinRequest) {
        // Проверка аутентификации пользователя
        if (userService.authenticateUser(signinRequest.getEmail(), signinRequest.getPassword())) {
            return ResponseEntity.ok("User logged in successfully");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

}
