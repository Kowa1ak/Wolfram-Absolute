package com.stk.wolframabsolute.controller;

import com.stk.wolframabsolute.entity.Application;
import com.stk.wolframabsolute.entity.User;
import com.stk.wolframabsolute.service.AppService;
import com.stk.wolframabsolute.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wolfram")
@AllArgsConstructor
public class AppController {
    private AppService service;
    private UserService userService;

    @GetMapping("/welcome")
    public String welcome(){
        return "Welcome to the unprotected page";
    }

    @GetMapping("/all-app")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public List<Application> allApplications() {
        return service.allApplications();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public Application applicationByID(@PathVariable int id) {
        return service.applicationByID(id);
    }

    /*@PostMapping("/registration")
    public String addUser(@RequestBody User user) {
        userService.addUser(user);
        return "Saved user: " + user.toString();
    }*/


}
