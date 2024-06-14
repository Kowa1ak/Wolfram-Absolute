package com.stk.wolframabsolute.requests;

import lombok.Data;

@Data
public class SlauRequest {
    private String equations;
    private int threads;
    private String library;
    private String email;
}