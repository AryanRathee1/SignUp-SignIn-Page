package com.aryan.backend.controller;

import com.aryan.backend.exception.WrongOTPException;
import com.aryan.backend.model.ChangePasswordBody;
import com.aryan.backend.model.OTPRequest;
import com.aryan.backend.model.User;
import com.aryan.backend.model.VerifyOTPRequest;
import com.aryan.backend.repository.UserRepository;
import com.aryan.backend.service.UpdatableBCrypt;
import com.aryan.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("http://localhost:3000")
public class ForgotController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @PostMapping("/user/otp")
    public void sendOTP(@RequestBody OTPRequest otpRequest) {
        //String username = otpRequest.getUsername();
        String email = otpRequest.getEmail();

        User user = userRepository.findByEmail(email);

        userService.sendOTPEmail(user);
    }

    @PostMapping("/user/verifyOTP")
    public Boolean verifyOTP(@RequestBody VerifyOTPRequest verifyOTPRequest){
        String oneTimePassword = verifyOTPRequest.getOneTimePassword();
        String email = verifyOTPRequest.getEmail();

        User user = userRepository.findByEmail(email);
        String otpHash = user.getOneTimePassword();

        Boolean valid = user.isOTPRequired();

        if(!valid){
            userService.clearOTP(user);
            throw new WrongOTPException(verifyOTPRequest.getUsername());
        }

        UpdatableBCrypt updatableBCrypt = new UpdatableBCrypt(11);

        boolean verify = updatableBCrypt.verifyHash(oneTimePassword,otpHash);
        String curHash = updatableBCrypt.hash(oneTimePassword);

        if(!verify){
            throw new WrongOTPException(verifyOTPRequest.getUsername(),email,oneTimePassword);
        }

        return true;
    }

    @PostMapping("/user/changePassword")
    public void changePassword(@RequestBody ChangePasswordBody changePasswordBody){
        String email = changePasswordBody.getEmail();
        String password = changePasswordBody.getPassword();

        User user = userRepository.findByEmail(email);

        userService.changePassword(user,password);
    }

}
