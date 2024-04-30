package com.stk.wolframabsolute.calculations;

import org.springframework.stereotype.Service;

@Service
public class NumberSystemConverter {
    public static String baseConversion(String number, int sBase, int dBase) {
        try {
            return Long.toString(Long.parseLong(number, sBase), dBase);
        } catch (NumberFormatException e) {
            return "Error: " + e.getMessage();
        }
    }
}
