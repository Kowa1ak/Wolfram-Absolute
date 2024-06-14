package com.stk.wolframabsolute.requests;

import lombok.Data;

@Data
public class ExponentiationRequest {
    double base;
    int exponent;
    String email;
    String library;
}
