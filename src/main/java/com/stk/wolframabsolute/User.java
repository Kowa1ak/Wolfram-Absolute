package com.stk.wolframabsolute;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Generated;

@Entity
@Table(name="users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String password;
}


