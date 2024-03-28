package com.stk.wolframabsolute.service;

import com.stk.wolframabsolute.entity.Role;
import com.stk.wolframabsolute.entity.User;
import com.stk.wolframabsolute.repository.RoleRepository;
import com.stk.wolframabsolute.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
    @Service
    public class UserService implements UserDetailsService {
        @PersistenceContext
        private EntityManager em;
        @Autowired
        UserRepository userRepository;
        @Autowired
        RoleRepository roleRepository;
        @Autowired
        BCryptPasswordEncoder bCryptPasswordEncoder;

        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
            User user = userRepository.findByUsername(username);

            if (user == null) {
                throw new UsernameNotFoundException("User not found");
            }

            return user;
        }

        public User findUserById(Long userId) {
            Optional<User> userFromDb = userRepository.findById(userId);
            return userFromDb.orElse(new User());
        }

        public List<User> allUsers() {
            return userRepository.findAll();
        }

        public boolean saveUser(User user) {
            User userFromDB = userRepository.findByUsername(user.getUsername());

            if (userFromDB != null) {
                return false;
            }

            user.setRoles(Collections.singleton(new Role(1L, "ROLE_USER")));
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            userRepository.save(user);
            return true;
        }

        public boolean deleteUser(Long userId) {
            if (userRepository.findById(userId).isPresent()) {
                userRepository.deleteById(userId);
                return true;
            }
            return false;
        }

        public List<User> usergtList(Long idMin) {
            return em.createQuery("SELECT u FROM User u WHERE u.id > :paramId", User.class)
                    .setParameter("paramId", idMin).getResultList();
        }
    }
