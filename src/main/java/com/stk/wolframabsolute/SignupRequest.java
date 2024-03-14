package com.stk.wolframabsolute;

import lombok.Data;

@Data
public class SignupRequest {
    private String email;
    private String username;
    private String password;
}
