package com.stk.wolframabsolute.requests;

import lombok.Data;

@Data
public class ODERequest {
    private String equation;
    private double y0;
    private double t0;
    private double t1;
    private double stepSize;
    private String library;
    private String email;
}