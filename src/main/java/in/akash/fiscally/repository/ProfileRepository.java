package in.akash.fiscally.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import in.akash.fiscally.entity.ProfileEntity;

public interface ProfileRepository extends JpaRepository<ProfileEntity,Long>{

    /**
     * Optional is a container object used to contain not-null objects. In simple terms, think of it as a box.
     * When you write Optional<ProfileEntity>, you are telling the computer: "I am going to give you a box. Inside that box, there might be a ProfileEntity, or the box might be empty."
     * @param email
     * @return
     */
    Optional<ProfileEntity> findByEmail(String email);

    Optional<ProfileEntity> findByActivationToken(String activationToken);

}
