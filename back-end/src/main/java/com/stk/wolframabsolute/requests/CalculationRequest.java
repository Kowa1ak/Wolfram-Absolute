package com.stk.wolframabsolute.requests;

import lombok.Data;

@Data
public class CalculationRequest {
    String email;
    String expression;
    String library;
    int threads;
}
