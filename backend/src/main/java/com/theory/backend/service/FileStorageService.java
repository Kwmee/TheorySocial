package com.theory.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
    );

    private final Path uploadDirectory;

    public FileStorageService(@Value("${app.upload-dir:uploads}") String uploadDir) {
        this.uploadDirectory = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    public String storeProfileImage(MultipartFile file) {
        validateImage(file);

        try {
            Files.createDirectories(uploadDirectory.resolve("profile-images"));

            String extension = resolveExtension(file.getOriginalFilename());
            String storedFilename = UUID.randomUUID() + extension;
            Path targetPath = uploadDirectory.resolve("profile-images").resolve(storedFilename);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/profile-images/" + storedFilename;
        } catch (IOException exception) {
            throw new IllegalArgumentException("Profile image could not be stored");
        }
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Profile image file is required");
        }

        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Profile image must be JPG, PNG, WEBP or GIF");
        }
    }

    private String resolveExtension(String originalFilename) {
        String extension = StringUtils.getFilenameExtension(originalFilename);
        return extension == null || extension.isBlank() ? "" : "." + extension.toLowerCase();
    }
}
