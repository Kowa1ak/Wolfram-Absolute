package com.stk.wolframabsolute.controller;

import com.stk.wolframabsolute.calculations.BasicOperations;
import com.stk.wolframabsolute.entity.CalculationRequest;
import com.stk.wolframabsolute.entity.User;
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

    //TODO:  запись запроса и результата в БД
    @PostMapping("/basic")
    public ResponseEntity<Map<String, String>> calculateResult(@RequestBody CalculationRequest request) {
        String result = basicOperations.calcResult(request.getThreads(), request.getExpression());
        Map<String, String> response = new HashMap<>();
        response.put("Result", result);
        return ResponseEntity.ok(response);
    }
}
