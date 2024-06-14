package com.stk.wolframabsolute.requests;

import lombok.Data;

@Data
public class NumSysConverterRequest {
    String email;
    String number;
    String library;
    int base1;
    int base2;
}
