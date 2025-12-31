package com.fitness.activityservice.repository;

import org.springframework.stereotype.Repository;

import com.fitness.activityservice.model.Activity;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;;

@Repository
public interface ActivityRepository extends MongoRepository<Activity, String> {
    List<Activity> findByUserId(String userId);
}
