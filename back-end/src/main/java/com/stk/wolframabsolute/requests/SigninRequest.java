package com.stk.wolframabsolute.requests;

import lombok.Data;

@Data
public class SigninRequest {
    private String email;
    private String password;

}