package com.stk.wolframabsolute.service;

import com.stk.wolframabsolute.config.UserDetailsImp;
import com.stk.wolframabsolute.entity.User;
import com.stk.wolframabsolute.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsImpService implements org.springframework.security.core.userdetails.UserDetailsService {
    @Autowired
    private UserRepository repository;
    @Override
    public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = repository.findByUsername(username);
        return user.map(UserDetailsImp::new)
                .orElseThrow(() -> new UsernameNotFoundException(username + " not found"));
    }
}
