#include "NativeConverter.h"
#include <string>
#include <algorithm>
#include <stdexcept>
#include <cctype>

// Класс для конвертации чисел между системами счисления
class BaseConverter {
public:
    // Метод для конвертации числа из одной системы счисления в другую
    static std::string convert(const std::string& number, int fromBase, int toBase) {
        if (fromBase < 2 || fromBase > 36 || toBase < 2 || toBase > 36) {
            throw std::invalid_argument("Base must be between 2 and 36.");
        }
        
        int decimal = toDecimal(number, fromBase);
        return fromDecimal(decimal, toBase);
    }

private:
    // Преобразование числа из любой системы счисления в десятичную
    static int toDecimal(const std::string& number, int base) {
        int value = 0;
        for (char digit : number) {
            value *= base;
            if (isdigit(digit)) {
                value += digit - '0';
            } else if (isalpha(digit)) {
                value += toupper(digit) - 'A' + 10;
            } else {
                throw std::invalid_argument("Invalid character in number.");
            }
        }
        return value;
    }

    // Преобразование числа из десятичной системы счисления в любую другую
    static std::string fromDecimal(int decimal, int base) {
        if (decimal == 0) return "0";

        std::string result;
        while (decimal > 0) {
            int remainder = decimal % base;
            if (remainder < 10) {
                result.push_back(remainder + '0');
            } else {
                result.push_back(remainder - 10 + 'A');
            }
            decimal /= base;
        }
        std::reverse(result.begin(), result.end());
        return result;
    }
};

// Реализация нативного метода convert
JNIEXPORT jstring JNICALL Java_NativeConverter_convert
  (JNIEnv *env, jobject, jstring number, jint fromBase, jint toBase) {
    const char *cNumber = env->GetStringUTFChars(number, 0);
    std::string result;

    try {
        result = BaseConverter::convert(std::string(cNumber), fromBase, toBase);
    } catch (const std::exception &e) {
        env->ReleaseStringUTFChars(number, cNumber);
        return env->NewStringUTF(e.what());
    }

    env->ReleaseStringUTFChars(number, cNumber);
    return env->NewStringUTF(result.c_str());
}
