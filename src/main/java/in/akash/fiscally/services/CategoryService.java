package in.akash.fiscally.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import in.akash.fiscally.dto.CategoryDTO;
import in.akash.fiscally.entity.CategoryEntity;
import in.akash.fiscally.entity.ProfileEntity;
import in.akash.fiscally.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProfileService profileService;

    // helper method
    private CategoryEntity toEntity(CategoryDTO CategoryDTO, ProfileEntity profileEntity){
        return CategoryEntity.builder()
                            .name(CategoryDTO.getName())
                            .icon(CategoryDTO.getIcon())
                            .profile(profileEntity)
                            .type(CategoryDTO.getType())
                            .build();
    }

    private CategoryDTO toDTO(CategoryEntity entity){
        return CategoryDTO.builder()
                        .id(entity.getId())
                        .profileId(entity.getProfile() != null ? entity.getProfile().getId() : null)
                        .name(entity.getName())
                        .icon(entity.getIcon())
                        .createdAt(entity.getCreatedAt())
                        .updatedAt(entity.getUpdatedAt())
                        .type(entity.getType())
                        .build();
    }

    // save category
    public CategoryDTO saveCategory(CategoryDTO categoryDTO){
        ProfileEntity profile = profileService.getCurrentProfile();
        if(categoryRepository.existsByNameAndProfileId(categoryDTO.getName(), profile.getId())){
            throw new RuntimeException("Category with this name is already exist");
        }

        CategoryEntity newCategory = toEntity(categoryDTO, profile);
        newCategory = categoryRepository.save(newCategory);
        return toDTO(newCategory); 
    }

    // get categories for current user
    public List<CategoryDTO> getCategoryForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<CategoryEntity> categories = categoryRepository.findByProfileId(profile.getId());
        return categories.stream().map(this::toDTO).toList();
    }

    // get categories by type for current user
    public List<CategoryDTO> getCategoriesByTypeForCurrentUser(String type){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<CategoryEntity> entities = categoryRepository.findByTypeAndProfileId(type, profile.getId());
        return entities.stream().map(this::toDTO).toList(); 
    }

    public CategoryDTO updateCategory(Long categoryId, CategoryDTO dto){
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity existingCategory =  categoryRepository.findByIdAndProfileId(categoryId, profile.getId())
                        .orElseThrow(()-> new RuntimeException("Category not found"));
        existingCategory.setName(dto.getName());
        existingCategory.setIcon(dto.getIcon());

        categoryRepository.save(existingCategory);
        return toDTO(existingCategory);
    }
}
