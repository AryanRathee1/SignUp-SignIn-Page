package com.aryan.backend.controller;
import com.aryan.backend.model.LoginRequest;
import com.aryan.backend.model.User;
import com.aryan.backend.service.UpdatableBCrypt;
import com.aryan.backend.service.UserService;
import com.aryan.backend.exception.UserNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.aryan.backend.repository.UserRepository;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    UpdatableBCrypt hashPassword = new UpdatableBCrypt(11);

    @PostMapping("/user")
    User newUser(@RequestBody User newUser){
        String password = newUser.getPassword();
        // hashing password
        String newPassword = hashPassword.hash(password);
        newUser.setPassword(newPassword);

        return userRepository.save(newUser);
    }

    /*@GetMapping("/users")
    List<User> getAllUsers(){
        return userRepository.findAll();
    }

    @GetMapping("/user/{id}")
    User getUserById(@PathVariable("id") Long id){
        //System.out.println(id);
        return userRepository.findById(id)
            .orElseThrow(()-> new UserNotFoundException(id));
    }*/

    @PostMapping("/user/login")
    public User signIn(@RequestBody LoginRequest loginRequest){
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        User user = new User();

        List<User> users = userRepository.findByUsername(username);

        Boolean correctPassword = false;

        for(int i=0;i<users.size();i++) {

            User curUser = users.get(i);
            User xUser = userRepository.findById(curUser.getId())
                    .orElseThrow(() -> new UserNotFoundException((curUser.getId())));

            String curHash = xUser.getPassword();

            correctPassword = hashPassword.verifyHash(password,curHash);

            if(correctPassword){

                user = userService.signIn(username, curHash);
                userService.sendLoginNotification(user.getEmail(), "login successful", "You have logged in\nThank You\nRegards");

                break;
            }
        }

        if(!correctPassword){
            throw new UserNotFoundException(username,password);
        }
        return user;

    }

    /*
    @GetMapping("/user/{username}/{password}")
    public User signIn(@PathVariable("username") String username, @PathVariable("password") String password) {
        String userEmail = userService.signIn(username, password).getEmail();
        userService.sendLoginNotification(userEmail, "login successful", "You have logged in\nThank You");
        return userService.signIn(username, password);
    }
     */

    @PostMapping("/user/login/download")
    public String download(@RequestBody LoginRequest loginRequest){
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        User user = new User();

        List<User> users = userRepository.findByUsername(username);

        Boolean correctPassword = false;

        for(int i=0;i<users.size();i++) {

            User curUser = users.get(i);
            User xUser = userRepository.findById(curUser.getId())
                    .orElseThrow(() -> new UserNotFoundException((curUser.getId())));

            String curHash = xUser.getPassword();

            correctPassword = hashPassword.verifyHash(password,curHash);

            if(correctPassword){
                user = userService.signIn(username, curHash);
                break;
            }
        }

        return userService.convertObjectToJson(user);
    }

    /*
    @GetMapping("/user/{username}/{password}/download")
    public String download(@PathVariable("username") String username, @PathVariable("password") String password){
        return userService.convertObjectToJson(userService.signIn(username, password));
    }
     */
}
