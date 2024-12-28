package org.example.gherabi_projet.repository;

import jakarta.transaction.Transactional;
import org.example.gherabi_projet.entities.Compte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CompteRepository extends JpaRepository<Compte, Integer> {
        Compte findByLogin(String login);
        @Query("SELECT c FROM Compte c LEFT JOIN FETCH c.professeur")
        List<Compte> findAllWithProfesseur();
        @Query(value = "DELETE FROM compte WHERE id = :id", nativeQuery = true)
        @Modifying
        @Transactional
        int deleteCompteById(@Param("id") Long id);
        }
