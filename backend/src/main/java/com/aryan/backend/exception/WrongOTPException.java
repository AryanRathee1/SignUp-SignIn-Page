package com.aryan.backend.exception;

public class WrongOTPException extends RuntimeException{
    public WrongOTPException(String username,String email, String otp){
        super("Wrong otp for "+username+"\nCheck otp sent to email: "+email);
    }

    public WrongOTPException(String username){
        super("Otp duration expired , Try resending OTP");
    }
}
