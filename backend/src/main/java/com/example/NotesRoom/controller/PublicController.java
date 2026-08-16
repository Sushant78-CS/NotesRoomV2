package com.example.NotesRoom.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public")
public class PublicController {

    @GetMapping("/test")
    public String test() {
        return "test";
    }

    @GetMapping("/health")
    public String health(){
        return "NotesRoom backend is running";
    }

}
