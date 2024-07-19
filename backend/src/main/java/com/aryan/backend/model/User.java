package com.aryan.backend.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.Date;

@Entity
public class User{

    @Id
    @GeneratedValue //(strategy=GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String name;

    private String email;
    private String password;

    private static final Long OTP_VALID_DURATION = (long) (5*60*1000); // 5min (in millisec)
    private String oneTimePassword;
    private Date otpRequestedTime;

    public Boolean isOTPRequired(){
        if(this.getOneTimePassword()==null){
            return false;
        }

        Long curTimeInMillis = System.currentTimeMillis();
        Long otpRequestTimeInMillis = this.otpRequestedTime.getTime();

        if( (OTP_VALID_DURATION + otpRequestTimeInMillis) < curTimeInMillis ){
            return false;
        }

        return true;
    }

    public String getOneTimePassword() {
        return oneTimePassword;
    }

    public void setOneTimePassword(String oneTimePassword) {
        this.oneTimePassword = oneTimePassword;
    }

    public Date getOtpRequestedTime() {
        return otpRequestedTime;
    }

    public void setOtpRequestedTime(Date otpRequestedTime) {
        this.otpRequestedTime = otpRequestedTime;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    

}