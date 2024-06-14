package com.stk.wolframabsolute.chat;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class MessageFilter {
    private static final Set<String> profanitySet = new HashSet<>(Arrays.asList("fuck", "shit", "damn", "bitch", "crap", "ass", "dammit", "bastard"));
    private static final String replacementString = "&*#!";

    public static String filterMessage(String message) {
        StringBuilder filteredMessage = new StringBuilder();
        String[] words = message.split(" ");
        for (String word : words) {
            if (profanitySet.contains(word.toLowerCase())) {
                filteredMessage.append(replacementString).append(" ");
            } else {
                filteredMessage.append(word).append(" ");
            }
        }
        return filteredMessage.toString().trim();
    }
}