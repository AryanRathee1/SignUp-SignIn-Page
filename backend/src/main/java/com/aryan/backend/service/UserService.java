package com.aryan.backend.service;
//import com.aryan.backend.exception.UserNotFoundException;
import com.aryan.backend.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aryan.backend.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import java.util.Date;
import java.util.Random;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User signIn(String username, String password) {
        return userRepository.findByUsernameAndPassword(username,password);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public String convertObjectToJson(User user){
        try {
            return objectMapper.writeValueAsString(user);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Autowired
    private JavaMailSender mailSender;

    public void sendLoginNotification(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public String generateOTP(User user){
        StringBuilder sb = new StringBuilder(6);

        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();

        for(int i=0;i<6;i++){
            int idx = random.nextInt(characters.length());
            sb.append(characters.charAt(idx));
        }
        return sb.toString();
    }

    public void sendOTPEmail(User user){
        String subject = "Here's your One Time Password (OTP) - Expire in 5 minutes!";

        String otp = generateOTP(user);
        String body = "OTP : "+ otp + "\nIt will expire in 5 minutes";

        UpdatableBCrypt updatableBCrypt =new UpdatableBCrypt(11);
        String hashedOTP = updatableBCrypt.hash(otp);

        user.setOneTimePassword(hashedOTP);
        user.setOtpRequestedTime(new Date());

        userRepository.save(user);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public void clearOTP(User user){
        user.setOtpRequestedTime(null);
        user.setOneTimePassword(null);
        userRepository.save(user);
    }

    public void changePassword(User user,String newPassword){
        UpdatableBCrypt updatableBCrypt =new UpdatableBCrypt(11);
        String hashPassword = updatableBCrypt.hash(newPassword);

        user.setPassword(hashPassword);
        userRepository.save(user);

        //clearOTP(user);
    }


}
