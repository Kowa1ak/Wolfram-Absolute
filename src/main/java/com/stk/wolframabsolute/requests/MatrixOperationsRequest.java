package com.stk.wolframabsolute.requests;

import lombok.Data;

@Data
public class MatrixOperationsRequest {
    String matrix1;
    String matrix2;
    int threads;
    String library;
    String email;
}
