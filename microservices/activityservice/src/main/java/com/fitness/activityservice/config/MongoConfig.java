package com.fitness.activityservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

@Configuration
@EnableMongoAuditing
public class MongoConfig {
    
    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create("mongodb://localhost:27017/fitnessactivity");
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), "fitnessactivity");
    }
}