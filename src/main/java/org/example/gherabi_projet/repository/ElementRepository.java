package org.example.gherabi_projet.repository;

import org.example.gherabi_projet.entities.Element;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ElementRepository extends JpaRepository<Element, Long> {
}
