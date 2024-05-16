package com.stk.wolframabsolute.controller;

import com.stk.wolframabsolute.calculations.*;
import com.stk.wolframabsolute.requests.*;
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
    CompoundInterestCalculator compoundInterestCalculator;


    //Basic operations mappings

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

    @PostMapping("/compound")
    public ResponseEntity<Map<String, String>> calculateInterest(@RequestBody CompoundInterestRequest request) {
        String result = Double.toString(compoundInterestCalculator.calculate(request.getInitialAmount(),
                request.getAdditionalContributions(), request.getInterestRate(),
                request.getContributionFrequency(), request.getInterestFrequency(),
                request.getYears()));

        Map<String,String> response = new HashMap<>();
        response.put("Result", result);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/exp")
    public ResponseEntity<Map<String, String>> exponentiation(@RequestBody ExponentiationRequest request) {
        String result = ExponentiationService.calculateExponentiation(request.getBase(), request.getExponent());
        Map<String,String> response = new HashMap<>();
        response.put("Result", result);
        return ResponseEntity.ok(response);
    }

    // Matrix mappings
    @PostMapping("/matrix_sum")
    public ResponseEntity<Map<String, String>> matrix_sum(@RequestBody MatrixOperationsRequest request) {
        String result = MatrixOperations.addMatrices(request.getMatrix1(), request.getMatrix2(), request.getThreads());
        Map<String,String> response = new HashMap<>();
        response.put("Result", result);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/matrix_multiply")
    public ResponseEntity<Map<String, String>> matrix_multiply(@RequestBody MatrixOperationsRequest request) {
        String result = MatrixOperations.multiplyMatrices(request.getMatrix1(), request.getMatrix2(), request.getThreads());
        Map<String,String> response = new HashMap<>();
        response.put("Result", result);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/matrix_transpose")
    public ResponseEntity<Map<String, String>> matrix_transpose(@RequestBody MatrixOperationsRequest request) {
        String result = MatrixOperations.transposeMatrix(request.getMatrix1(), request.getThreads());
        Map<String,String> response = new HashMap<>();
        response.put("Result", result);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/matrix_by_scalar")
    public ResponseEntity<Map<String, String>> matrix_by_scalar(@RequestBody MatrixOperationsRequest request) {
        String result = MatrixOperations.multiplyMatrixByScalar(request.getMatrix1(), Integer.valueOf(request.getMatrix2()));
        Map<String,String> response = new HashMap<>();
        response.put("Result", result);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/matrix_find_inverse")
    public ResponseEntity<Map<String, String>> matrix_find_inverse(@RequestBody MatrixOperationsRequest request) {
        String result = MatrixOperations.findInverseMatrix(request.getMatrix1(), request.getThreads());
        Map<String,String> response = new HashMap<>();
        response.put("Result", result);
        return ResponseEntity.ok(response);
    }

}
