package com.aryan.backend.exception;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException(Long id){
        super("could not find user with id "+id);
    }
    public UserNotFoundException(String username, String password){
        super("could not find user with given combination of username ("+ username+") and password ("+password+")");
    }
}
