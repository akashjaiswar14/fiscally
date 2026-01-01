package in.akash.fiscally.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import in.akash.fiscally.entity.IncomeEntity;

public interface IncomeRepository extends JpaRepository<IncomeEntity, Long>{

    // select * from tbl_income where profile_id = ?1 order by date desc
    List<IncomeEntity> findByProfileIdOrderByDateDesc(Long profileId);

    // select * from tbl_income where profile_id = ?1 order by date desc limit 5
    List<IncomeEntity> findTop5ByProfileIdOrderByDateDesc(Long profileId);

    @Query("SELECT SUM(e.amount) From IncomeEntity e WHERE e.profile.id = :profileId")
    BigDecimal findTotalExpenseByProfileId(@Param("profileId") Long profileId);

    // @Query("SELECT * FROM tbl_income WHERE profile_id = ?1 AND DATE BETWEEN ?2 AND ?3 AND name LIKE %?4%")
    List<IncomeEntity> findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(
        Long profileId,
        LocalDate startDate,
        LocalDate endDate,
        String keyword,
        Sort sort
    );

    // SELECT * FROM tbl_income WHERE profile_id = 1? AND DATE BETWEEN ?2 AND ?3)
    List<IncomeEntity> findByProfileIdAndDateBetween(Long profileId, LocalDate startDate, LocalDate endDate);
}
