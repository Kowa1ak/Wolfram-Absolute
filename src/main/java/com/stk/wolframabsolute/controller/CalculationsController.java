package com.stk.wolframabsolute.controller;

import com.stk.wolframabsolute.calculations.BasicOperations;
import com.stk.wolframabsolute.calculations.NumberSystemConverter;
import com.stk.wolframabsolute.requests.CalculationRequest;
import com.stk.wolframabsolute.requests.NumSysConverterRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/wolfram")
@AllArgsConstructor
public class CalculationsController {
    BasicOperations basicOperations;
    NumberSystemConverter converter;

    //TODO:  запись запроса и результата в БД
    @PostMapping("/basic")
    public ResponseEntity<Map<String, String>> calculateResult(@RequestBody CalculationRequest request) {
        String result = basicOperations.calcResult(request.getThreads(), request.getExpression());
        Map<String, String> response = new HashMap<>();
        response.put("Result", result);
        return ResponseEntity.ok(response);
    }

    //TODO:  запись запроса и результата в БД
    @PostMapping("/converter")
    public ResponseEntity<Map<String, String>> numSysConv(@RequestBody NumSysConverterRequest request) {
        String result = converter.baseConversion(request.getNumber(), request.getBase1(), request.getBase2());
        Map<String, String> response = new HashMap<>();
        response.put("Result", result.toUpperCase());
        return ResponseEntity.ok(response);
    }
}
