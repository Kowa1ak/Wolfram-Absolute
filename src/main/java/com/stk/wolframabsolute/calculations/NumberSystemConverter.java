package com.stk.wolframabsolute.calculations;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

@Service
public class NumberSystemConverter {

    private static final Logger logger = LogManager.getLogger(NumberSystemConverter.class);

    public static String baseConversion(String number, int sBase, int dBase) {
        logger.info("Starting base conversion for number: {} from base {} to base {}", number, sBase, dBase);
        try {
            String result = Long.toString(Long.parseLong(number, sBase), dBase);
            logger.info("Conversion successful. Result: {}", result);
            return result;
        } catch (NumberFormatException e) {
            logger.error("NumberFormatException occurred during conversion: {}", e.getMessage());
            return "Error: " + e.getMessage();
        } catch (Exception e) {
            logger.error("Unexpected exception occurred during conversion", e);
            return "Error: " + e.getMessage();
        }
    }
}