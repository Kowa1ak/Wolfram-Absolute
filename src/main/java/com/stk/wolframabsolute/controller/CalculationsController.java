package com.stk.wolframabsolute.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stk.wolframabsolute.calculations.*;
import com.stk.wolframabsolute.entity.Calculation;
import com.stk.wolframabsolute.requests.*;
import com.stk.wolframabsolute.service.CalculationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name  = "Calculations API", description = "API для вычислений различных математических задач")
public class CalculationsController {
    private static final Logger logger = LogManager.getLogger(CalculationsController.class);
    private final ObjectMapper objectMapper;
    BasicOperations basicOperations;
    NumberSystemConverter converter;
    SLAUSolverService solverService;
    CompoundInterestCalculator compoundInterestCalculator;
    ODESolverService ODEsolver;
    CalculationService calculationService;

    @PostMapping("/by-email")
    @Operation(summary  = "Получить вычисления по email", description  = "Возвращает список вычислений, связанных с заданным email")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Успешно", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = Calculation.class))
            }),
            @ApiResponse(responseCode  = "400", description  = "Некорректный запрос"),
            @ApiResponse(responseCode  = "404", description  = "Email не найден")
    })
    public ResponseEntity<?> getCalculationsByEmail(
            @RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        try {
            List<Calculation> calculations = calculationService.getCalculationsByEmail(email);
            return ResponseEntity.ok(calculations);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping("/solveODE")
    @Operation(summary = "Решить ОДУ", description = "Решает обыкновенное дифференциальное уравнение")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description  = "Успешно"),
            @ApiResponse(responseCode = "500", description  = "Ошибка сервера")
    })
    public ResponseEntity<?> solveODE(
            @RequestBody ODERequest odeRequest) {
        logger.info("Received ODE calculation request: {}", odeRequest);
        String result = ODEsolver.solveODE(
                odeRequest.getEquation(),
                odeRequest.getY0(),
                odeRequest.getT0(),
                odeRequest.getT1(),
                odeRequest.getStepSize()
        );
        if (result.startsWith("Error:")) {
            logger.error("Error", "Error in system solving: " + result);
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", result));
        }
        logger.info("calculation result: {}", result);
        Calculation calculation = new Calculation();
        calculation.setEmail(odeRequest.getEmail());
        calculation.setCalculationType("ode");
        calculation.setInputData(odeRequest.getEquation());
        calculation.setResultData(result);
        calculationService.addCalculation(calculation);
        return ResponseEntity.ok(Collections.singletonMap("solution", result));
    }

    @PostMapping("/slau")
    @Operation(summary = "Решить систему линейных уравнений", description = "Решает систему линейных алгебраических уравнений (СЛАУ)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description  = "Успешно"),
            @ApiResponse(responseCode = "500", description  = "Ошибка сервера")
    })
    public ResponseEntity<Map<String, String>> solveSlau(
            @RequestBody SlauRequest request) {
        logger.info("Received sys solving calculation request: {}", request);
        String result;
        Map<String, String> response = new HashMap<>();
        try {
            result = solverService.solve(request.getEquations(), request.getThreads());
            response.put("Result", result);
        } catch (Exception e) {
            response.put("Error", "Error in system solving: " + e.getMessage());
            logger.error("Error", "Error in system solving: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
        logger.info("calculation result: {}", response);
        Calculation calculation = new Calculation();
        calculation.setEmail(request.getEmail());
        calculation.setCalculationType("slau");
        calculation.setInputData(request.getEquations());
        calculation.setResultData(result);
        calculationService.addCalculation(calculation);
        return ResponseEntity.ok(response);
    }


    //Basic operations mappings
    @PostMapping("/basic")
    @Operation(summary = "Выполнить базовые операции", description = "Выполняет базовые математические операции")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description  = "Успешно"),
            @ApiResponse(responseCode = "500", description  = "Ошибка сервера")
    })
    public ResponseEntity<Map<String, String>> calculateResult(
            @RequestBody CalculationRequest request) {
        logger.info("Received basic calculation request: {}", request);
        String result = basicOperations.calcResult(request.getThreads(), request.getExpression());
        Map<String, String> response = new HashMap<>();
        response.put("Result", result);
        logger.info("Basic calculation result: {}", result);
        Calculation calculation = new Calculation();
        calculation.setEmail(request.getEmail());
        calculation.setCalculationType("slau");
        calculation.setInputData(request.getExpression());
        calculation.setResultData(result);
        calculationService.addCalculation(calculation);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/converter")
    @Operation(summary = "Конвертация систем счисления", description = "Конвертирует число из одной системы счисления в другую")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description  = "Успешно"),
            @ApiResponse(responseCode = "500", description  = "Ошибка сервера")
    })
    public ResponseEntity<Map<String, String>> numSysConv(
            @RequestBody NumSysConverterRequest request) {
        logger.info("Received number system conversion request: {}", request);
        String result = converter.baseConversion(request.getNumber(), request.getBase1(), request.getBase2());
        Map<String, String> response = new HashMap<>();
        response.put("Result", result.toUpperCase());
        logger.info("Number system conversion result: {}", result.toUpperCase());
        Calculation calculation = new Calculation();
        calculation.setEmail(request.getEmail());
        calculation.setCalculationType("slau");
        calculation.setInputData(request.getNumber());
        calculation.setResultData(result);
        calculationService.addCalculation(calculation);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/compound")
    @Operation(summary = "Рассчитать сложные проценты", description = "Рассчитывает сложные проценты на основе заданных параметров")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description  = "Успешно"),
            @ApiResponse(responseCode = "500", description  = "Ошибка сервера")
    })
    public ResponseEntity<List<Map<String, String>>> calculateInterest(
            @RequestBody CompoundInterestRequest request) {
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

        CompoundInterestCalculator.YearlyInfo finalResult = results.get(results.size() - 1);
        Calculation calculation = new Calculation();
        calculation.setEmail(request.getEmail());
        calculation.setCalculationType("compound_interest");
        calculation.setInputData(request.toString());

        try {
            String finalResultData = objectMapper.writeValueAsString(finalResult);
            calculation.setResultData(finalResultData);
        } catch (JsonProcessingException e) {
            logger.error("Error serializing calculation results", e);
            return ResponseEntity.status(500).body(null);
        }

        calculationService.addCalculation(calculation);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/exp")
    @Operation(summary = "Выполнить возведение в степень", description = "Выполняет операцию возведения числа в степень")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description  = "Успешно"),
            @ApiResponse(responseCode = "500", description  = "Ошибка сервера")
    })
    public ResponseEntity<Map<String, String>> exponentiation(
            @RequestBody ExponentiationRequest request) {
        logger.info("Received exponentiation request: {}", request);
        Map<String, String> response = new HashMap<>();

        Calculation calculation = new Calculation();
        calculation.setEmail(request.getEmail());
        calculation.setCalculationType("exponentiation");
        calculation.setInputData(request.toString());

        try {
            String result = ExponentiationService.calculateExponentiation(request.getBase(), request.getExponent());
            response.put("Result", result);
            calculation.setResultData(result);
            logger.info("Exponentiation result: {}", result);
        } catch (Exception e) {
            logger.error("Error during exponentiation", e);
            response.put("Error", e.getMessage());
            calculation.setResultData("Error: " + e.getMessage());
            calculationService.addCalculation(calculation);
            return ResponseEntity.status(500).body(response);
        }

        calculationService.addCalculation(calculation);
        return ResponseEntity.ok(response);
    }

    // Matrix mappings
    @PostMapping("/matrix_sum")
    @Operation(summary = "Сложить матрицы", description = "Выполняет операцию сложения двух матриц")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description  = "Успешно"),
            @ApiResponse(responseCode = "500", description  = "Ошибка сервера")
    })
    public ResponseEntity<Map<String, String>> matrix_sum(
            @RequestBody MatrixOperationsRequest request) {
        logger.info("Received matrix sum request: {}", request);
        Map<String, String> response = new HashMap<>();

        Calculation calculation = new Calculation();
        calculation.setEmail(request.getEmail());
        calculation.setCalculationType("matrix_sum");
        calculation.setInputData(request.toString());

        try {
            String result = MatrixOperations.addMatrices(request.getMatrix1(), request.getMatrix2(), request.getThreads());
            response.put("Result", result);
            calculation.setResultData(result);
            logger.info("Matrix sum result: {}", result);
        } catch (Exception e) {
            logger.error("Error during matrix sum operation", e);
            response.put("Error", e.getMessage());
            calculation.setResultData("Error: " + e.getMessage());
            calculationService.addCalculation(calculation);
            return ResponseEntity.status(500).body(response);
        }

        calculationService.addCalculation(calculation);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/matrix_multiply")
    @Operation(summary = "Перемножить матрицы", description = "Выполняет операцию умножения двух матриц")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description  = "Успешно"),
            @ApiResponse(responseCode = "500", description  = "Ошибка сервера")
    })
    public ResponseEntity<Map<String, String>> matrix_multiply(
            @RequestBody MatrixOperationsRequest request) {
        logger.info("Received matrix multiplication request: {}", request);
        Map<String, String> response = new HashMap<>();

        Calculation calculation = new Calculation();
        calculation.setEmail(request.getEmail());
        calculation.setCalculationType("matrix_multiply");
        calculation.setInputData(request.toString());

        try {
            String result = MatrixOperations.multiplyMatrices(request.getMatrix1(), request.getMatrix2(), request.getThreads());
            response.put("Result", result);
            calculation.setResultData(result);
            logger.info("Matrix multiplication result: {}", result);
        } catch (Exception e) {
            logger.error("Error during matrix multiplication operation", e);
            response.put("Error", e.getMessage());
            calculation.setResultData("Error: " + e.getMessage());
            calculationService.addCalculation(calculation);
            return ResponseEntity.status(500).body(response);
        }

        calculationService.addCalculation(calculation);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/matrix_transpose")
    @Operation(summary = "Транспонировать матрицу", description = "Выполняет операцию транспонирования матрицы")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description  = "Успешно"),
            @ApiResponse(responseCode = "500", description  = "Ошибка сервера")
    })
    public ResponseEntity<Map<String, String>> matrix_transpose(
            @RequestBody MatrixOperationsRequest request) {
        logger.info("Received matrix transpose request: {}", request);
        Map<String, String> response = new HashMap<>();

        Calculation calculation = new Calculation();
        calculation.setEmail(request.getEmail());
        calculation.setCalculationType("matrix_transpose");
        calculation.setInputData(request.toString());

        try {
            String result = MatrixOperations.transposeMatrix(request.getMatrix1(), request.getThreads());
            response.put("Result", result);
            calculation.setResultData(result);
            logger.info("Matrix transpose result: {}", result);
        } catch (Exception e) {
            logger.error("Error during matrix transpose operation", e);
            response.put("Error", e.getMessage());
            calculation.setResultData("Error: " + e.getMessage());
            calculationService.addCalculation(calculation);
            return ResponseEntity.status(500).body(response);
        }

        calculationService.addCalculation(calculation);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/matrix_by_scalar")
    @Operation(summary = "Умножить матрицу на скаляр", description = "Выполняет операцию умножения матрицы на скаляр")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description  = "Успешно"),
            @ApiResponse(responseCode = "500", description  = "Ошибка сервера")
    })
    public ResponseEntity<Map<String, String>> matrix_by_scalar(
            @RequestBody MatrixOperationsRequest request) {
        logger.info("Received matrix by scalar multiplication request: {}", request);
        Map<String, String> response = new HashMap<>();

        Calculation calculation = new Calculation();
        calculation.setEmail(request.getEmail());
        calculation.setCalculationType("matrix_by_scalar");
        calculation.setInputData(request.toString());

        try {
            String result = MatrixOperations.multiplyMatrixByScalar(request.getMatrix1(), Integer.valueOf(request.getMatrix2()));
            response.put("Result", result);
            calculation.setResultData(result);
            logger.info("Matrix by scalar multiplication result: {}", result);
        } catch (Exception e) {
            logger.error("Error during matrix by scalar multiplication operation", e);
            response.put("Error", e.getMessage());
            calculation.setResultData("Error: " + e.getMessage());
            calculationService.addCalculation(calculation);
            return ResponseEntity.status(500).body(response);
        }

        calculationService.addCalculation(calculation);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/matrix_find_inverse")
    @Operation(summary = "Найти обратную матрицу", description = "Выполняет операцию нахождения обратной матрицы")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description  = "Успешно"),
            @ApiResponse(responseCode = "500", description  = "Ошибка сервера")
    })
    public ResponseEntity<Map<String, String>> matrix_find_inverse(
            @RequestBody MatrixOperationsRequest request) {
        logger.info("Find inverse matrix request: {}", request);
        Map<String, String> response = new HashMap<>();

        Calculation calculation = new Calculation();
        calculation.setEmail(request.getEmail());
        calculation.setCalculationType("matrix_find_inverse");
        calculation.setInputData(request.toString());

        try {
            String result = MatrixOperations.findInverseMatrix(request.getMatrix1(), request.getThreads());
            response.put("Result", result);
            calculation.setResultData(result);
            logger.info("Find inverse matrix result: {}", result);
        } catch (Exception e) {
            logger.error("Error during find inverse matrix operation", e);
            response.put("Error", e.getMessage());
            calculation.setResultData("Error: " + e.getMessage());
            calculationService.addCalculation(calculation);
            return ResponseEntity.status(500).body(response);
        }

        calculationService.addCalculation(calculation);
        return ResponseEntity.ok(response);
    }

}
