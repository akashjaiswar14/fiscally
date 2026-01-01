package in.akash.fiscally.services;

import org.springframework.stereotype.Service;

import in.akash.fiscally.dto.IncomeDTO;
import in.akash.fiscally.entity.CategoryEntity;
import in.akash.fiscally.entity.IncomeEntity;
import in.akash.fiscally.entity.ProfileEntity;
import in.akash.fiscally.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IncomeService {

    private final CategoryService categoryService;
    private final IncomeRepository incomeRepository;

    // helper method
    private IncomeEntity toEntity(IncomeDTO dto, ProfileEntity profile, CategoryEntity category){
        return IncomeEntity.builder()
                            .name(dto.getName())
                            .icon(dto.getIcon())
                            .amount(dto.getAmount())
                            .date(dto.getDate())
                            .profile(profile)
                            .category(category)
                            .build();
    }

    private IncomeDTO toDTO(IncomeEntity entity){
        return IncomeDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .icon(entity.getIcon())
                .categoryId(entity.getCategory() != null ? entity.getCategory().getId(): null)
                .categoryName(entity.getCategory() != null ? entity.getCategory().getName(): "N/A")
                .amount(entity.getAmount())
                .date(entity.getDate())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
