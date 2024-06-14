package com.stk.wolframabsolute.calculations;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

@Service
public class NumberSystemConverter {

    private static final Logger logger = LogManager.getLogger(NumberSystemConverter.class);

    static {
        try {
            System.loadLibrary("NativeConverter"); // Загрузка нативной библиотеки
        } catch (UnsatisfiedLinkError e) {
            logger.error("Failed to load NativeConverter library: {}", e.getMessage());
        }
    }

    // Объявление нативного метода
    public native String convert(String number, int fromBase, int toBase);

    public String baseConversion(String number, int sBase, int dBase, String library) {
        logger.info("Starting base conversion for number: {} from base {} to base {} using library {}", number, sBase, dBase, library);
        try {
            if ("C++".equalsIgnoreCase(library)) {
                logger.info("Using C++ library for conversion");
                String result = convert(number, sBase, dBase);
                logger.info("Conversion successful using C++. Result: {}", result);
                return result;
            } else {
                logger.info("Using Java for conversion");
                String result = Long.toString(Long.parseLong(number, sBase), dBase);
                logger.info("Conversion successful using Java. Result: {}", result);
                return result;
            }
        } catch (NumberFormatException e) {
            logger.error("NumberFormatException occurred during conversion: {}", e.getMessage());
            return "Error: " + e.getMessage();
        } catch (Exception e) {
            logger.error("Unexpected exception occurred during conversion", e);
            return "Error: " + e.getMessage();
        }
    }
}
