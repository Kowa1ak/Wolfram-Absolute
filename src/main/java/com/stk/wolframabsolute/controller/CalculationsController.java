package com.stk.wolframabsolute.controller;

import com.stk.wolframabsolute.calculations.*;
import com.stk.wolframabsolute.requests.*;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.*;

@RestController
@RequestMapping("/wolfram")
@AllArgsConstructor
public class CalculationsController {
    private static final Logger logger = LogManager.getLogger(CalculationsController.class);
    BasicOperations basicOperations;
    NumberSystemConverter converter;
    SLAUSolverService solverService;
    CompoundInterestCalculator compoundInterestCalculator;
    ODESolverService ODEsolver;

    @PostMapping("/solveODE")
    public ResponseEntity<?> solveODE(@RequestBody ODERequest odeRequest) {
        String result = ODEsolver.solveODE(
                odeRequest.getEquation(),
                odeRequest.getY0(),
                odeRequest.getT0(),
                odeRequest.getT1(),
                odeRequest.getStepSize()
        );
        if (result.startsWith("Error:")) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", result));
        }
        return ResponseEntity.ok(Collections.singletonMap("solution", result));
    }

    @PostMapping("/slau")
    public ResponseEntity<Map<String, String>> solveSlau(@RequestBody SlauRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            String result = solverService.solve(request.getEquations(), request.getThreads());
            response.put("Result", result);
        } catch (Exception e) {
            response.put("Error", "Error in system solving: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
        return ResponseEntity.ok(response);
    }


    //Basic operations mappings

    //TODO:  запись запроса и результата в БД
    @PostMapping("/basic")
    public ResponseEntity<Map<String, String>> calculateResult(@RequestBody CalculationRequest request) {
        logger.info("Received basic calculation request: {}", request);
        String result = basicOperations.calcResult(request.getThreads(), request.getExpression());
        Map<String, String> response = new HashMap<>();
        response.put("Result", result);
        logger.info("Basic calculation result: {}", result);
        return ResponseEntity.ok(response);
    }

    //TODO:  запись запроса и результата в БД
    @PostMapping("/converter")
    public ResponseEntity<Map<String, String>> numSysConv(@RequestBody NumSysConverterRequest request) {
        logger.info("Received number system conversion request: {}", request);
        String result = converter.baseConversion(request.getNumber(), request.getBase1(), request.getBase2());
        Map<String, String> response = new HashMap<>();
        response.put("Result", result.toUpperCase());
        logger.info("Number system conversion result: {}", result.toUpperCase());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/compound")
    public ResponseEntity<List<Map<String, String>>> calculateInterest(@RequestBody CompoundInterestRequest request) {
        logger.info("Received compound interest calculation request: {}", request);

        List<CompoundInterestCalculator.YearlyInfo> results = compoundInterestCalculator.calculate(
                request.getInitialAmount(),
                request.getAdditionalContributions(),
                request.getInterestRate(),
                request.getContributionFrequency(),
                request.getInterestFrequency(),
                request.getYears()
        );

        List<Map<String, String>> response = new ArrayList<>();
        for (CompoundInterestCalculator.YearlyInfo result : results) {
            Map<String, String> yearResult = new HashMap<>();
            yearResult.put("InitialAmount", Double.toString(result.initialAmount));
            yearResult.put("AdditionalContributions", Double.toString(result.additionalContributions));
            yearResult.put("Interest", Double.toString(result.interest));
            response.add(yearResult);
            logger.info("Yearly result: InitialAmount={}, AdditionalContributions={}, Interest={}",
                    result.initialAmount, result.additionalContributions, result.interest);
        }

        logger.info("Compound interest calculation completed with {} years of data.", results.size());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/exp")
    public ResponseEntity<Map<String, String>> exponentiation(@RequestBody ExponentiationRequest request) {
        logger.info("Received exponentiation request: {}", request);
        String result = ExponentiationService.calculateExponentiation(request.getBase(), request.getExponent());
        Map<String,String> response = new HashMap<>();
        response.put("Result", result);
        logger.info("Exponentiation result: {}", result);
        return ResponseEntity.ok(response);
    }

    // Matrix mappings
    @PostMapping("/matrix_sum")
    public ResponseEntity<Map<String, String>> matrix_sum(@RequestBody MatrixOperationsRequest request) {
        logger.info("Received matrix sum request: {}", request);
        String result = MatrixOperations.addMatrices(request.getMatrix1(), request.getMatrix2(), request.getThreads());
        Map<String,String> response = new HashMap<>();
        response.put("Result", result);
        logger.info("Matrix sum result: {}", result);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/matrix_multiply")
    public ResponseEntity<Map<String, String>> matrix_multiply(@RequestBody MatrixOperationsRequest request) {
        logger.info("Received matrix multiplication request: {}", request);
        String result = MatrixOperations.multiplyMatrices(request.getMatrix1(), request.getMatrix2(), request.getThreads());
        Map<String,String> response = new HashMap<>();
        response.put("Result", result);
        logger.info("Matrix multiplication result: {}", result);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/matrix_transpose")
    public ResponseEntity<Map<String, String>> matrix_transpose(@RequestBody MatrixOperationsRequest request) {
        logger.info("Received matrix transpose request: {}", request);
        String result = MatrixOperations.transposeMatrix(request.getMatrix1(), request.getThreads());
        Map<String,String> response = new HashMap<>();
        response.put("Result", result);
        logger.info("Matrix transpose result: {}", result);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/matrix_by_scalar")
    public ResponseEntity<Map<String, String>> matrix_by_scalar(@RequestBody MatrixOperationsRequest request) {
        logger.info("Received matrix by scalar multiplication request: {}", request);
        String result = MatrixOperations.multiplyMatrixByScalar(request.getMatrix1(), Integer.valueOf(request.getMatrix2()));
        Map<String,String> response = new HashMap<>();
        response.put("Result", result);
        logger.info("Matrix by scalar multiplication result: {}", result);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/matrix_find_inverse")
    public ResponseEntity<Map<String, String>> matrix_find_inverse(@RequestBody MatrixOperationsRequest request) {
        logger.info("Find inverse matrix request: {}", request);
        String result = MatrixOperations.findInverseMatrix(request.getMatrix1(), request.getThreads());
        Map<String,String> response = new HashMap<>();
        response.put("Result", result);
        logger.info("Find inverse matrix result: {}", result);
        return ResponseEntity.ok(response);
    }

}
