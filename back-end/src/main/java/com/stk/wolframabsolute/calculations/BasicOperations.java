package com.stk.wolframabsolute.calculations;

import net.objecthunter.exp4j.Expression;
import net.objecthunter.exp4j.ExpressionBuilder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@Service
public class BasicOperations {
    private static final Logger logger = LogManager.getLogger(BasicOperations.class);

    ExecutorService exec;
    public String calcResult(int threads, String expression) {
        double resultExp = 0;
        String result = "";
        logger.info("Starting calculation with {} threads for expression: {}", threads, expression);

        exec = Executors.newFixedThreadPool(threads);
        Expression e = new ExpressionBuilder(expression).build();
        Future<Double> future = e.evaluateAsync(exec);
        try {
            resultExp = future.get();
            result = Double.toString(resultExp);
            logger.info("Calculation result: {}", result);
        } catch (ExecutionException ex) {
            if (ex.getCause() instanceof ArithmeticException) {
                result = "Division by zero";
                logger.warn("ArithmeticException: Division by zero for expression: {}", expression);
            } else {
                logger.error("ExecutionException occurred", ex);
            }
        } catch (Exception ex) {
            logger.error("Exception occurred", ex);
        } finally {
            shutdownExecutor();
        }
        return result;
    }

    public void shutdownExecutor() {
        if (exec != null) {
            exec.shutdown();
            logger.info("ExecutorService has been shutdown");
        }
    }

}
