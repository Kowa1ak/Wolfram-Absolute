package com.stk.wolframabsolute.calculations;
import org.apache.commons.math3.ode.FirstOrderDifferentialEquations;
import org.apache.commons.math3.ode.FirstOrderIntegrator;
import org.apache.commons.math3.ode.nonstiff.ClassicalRungeKuttaIntegrator;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

@Service
public class ODESolverService {

    private static final Logger logger = LogManager.getLogger(ODESolverService.class);

    private static class ParsedODE implements FirstOrderDifferentialEquations {
        private final ScriptEngine engine;
        private final String equation;

        public ParsedODE(String equation) {
            this.equation = equation;
            this.engine = new ScriptEngineManager().getEngineByName("JavaScript");
            if (this.engine == null) {
                throw new RuntimeException("JavaScript engine not found. Please check your JDK installation.");
            }
        }

        @Override
        public int getDimension() {
            return 1; // assuming a single ODE (dy/dx = f(x, y))
        }

        @Override
        public void computeDerivatives(double t, double[] y, double[] yDot) {
            try {
                engine.put("x", t);
                engine.put("y", y[0]);
                Object result = engine.eval(equation);
                if (result instanceof Number) {
                    yDot[0] = ((Number) result).doubleValue();
                } else {
                    String message = "The equation did not evaluate to a number.";
                    logger.error(message);
                    yDot[0] = Double.NaN; // Use NaN to indicate an error
                }
            } catch (ScriptException e) {
                String message = "Error evaluating the equation: " + e.getMessage();
                logger.error(message, e);
                yDot[0] = Double.NaN; // Use NaN to indicate an error
            }
        }
    }

    public String solveODE(String equation, double y0, double t0, double t1, double stepSize) {
        if (equation == null || equation.isEmpty()) {
            String message = "The equation cannot be null or empty.";
            logger.error(message);
            return "Error: " + message;
        }
        if (stepSize <= 0) {
            String message = "Step size must be positive.";
            logger.error(message);
            return "Error: " + message;
        }
        if (t0 >= t1) {
            String message = "Initial time t0 must be less than final time t1.";
            logger.error(message);
            return "Error: " + message;
        }

        try {
            FirstOrderDifferentialEquations ode = new ParsedODE(equation);
            FirstOrderIntegrator integrator = new ClassicalRungeKuttaIntegrator(stepSize);

            double[] y = new double[]{y0};
            integrator.integrate(ode, t0, y, t1, y); // integrates from t0 to t1, y[0] is updated in-place

            if (Double.isNaN(y[0])) {
                return "Error: An error occurred during the integration process.";
            }

            return String.format("Solution at x = %.2f is y = %.5f", t1, y[0]);
        } catch (Exception e) {
            String message = "Unexpected error occurred while solving the ODE: " + e.getMessage();
            logger.error(message, e);
            return "Error: " + message;
        }
    }

}
