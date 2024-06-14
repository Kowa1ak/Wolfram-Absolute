package com.stk.wolframabsolute.calculations;

import org.springframework.stereotype.Service;

@Service
public class ExponentiationService {
    public static String calculateExponentiation(double base, int exponent) {
        double result = Math.pow(base, exponent);
        return Double.toString(result);
    }
}
