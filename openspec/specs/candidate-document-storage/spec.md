## ADDED Requirements

### Requirement: CV/resume upload
The system SHALL allow uploading CV/resume files for candidates with secure file handling.

#### Scenario: Upload CV file
- **WHEN** Owner or Manager uploads CV file for candidate
- **THEN** system validates file type (PDF, DOC, DOCX)
- **AND** system validates file size (maximum 10MB)
- **AND** system uploads file to Google Cloud Storage
- **AND** system stores file metadata (filename, size, mimeType, storagePath, uploadedAt, uploadedBy) in database
- **AND** system links file to candidate record

#### Scenario: Upload CV access control
- **WHEN** Admin attempts to upload CV file
- **THEN** system allows upload
- **AND** file is stored and linked to candidate

#### Scenario: Upload CV with invalid file
- **WHEN** user attempts to upload invalid file type or oversized file
- **THEN** system returns validation error
- **AND** file is not uploaded
- **AND** error message explains validation failure

#### Scenario: Replace existing CV
- **WHEN** user uploads new CV for candidate with existing CV
- **THEN** system archives or deletes old CV file from storage
- **AND** system updates candidate record with new CV metadata
- **AND** system maintains CV history if configured

### Requirement: CV/resume storage
The system SHALL store CV/resume files securely in Google Cloud Storage.

#### Scenario: Store file in Google Cloud Storage
- **WHEN** system uploads CV file
- **THEN** system stores file in configured Google Cloud Storage bucket
- **AND** file path follows naming convention (e.g., `candidates/{candidateId}/cv/{timestamp}-{filename}`)
- **AND** file is stored with appropriate permissions (private access)

#### Scenario: File storage configuration
- **WHEN** system initializes document storage
- **THEN** system uses Google Cloud Storage credentials from environment variables
- **AND** system uses configured bucket name from environment variables
- **AND** system handles storage errors gracefully

### Requirement: CV/resume download
The system SHALL allow downloading CV/resume files for authorized users.

#### Scenario: Download CV file
- **WHEN** authenticated user downloads candidate CV
- **THEN** system retrieves file from Google Cloud Storage
- **AND** system streams file to user with appropriate content type
- **AND** system logs download activity (who, when, which file)

#### Scenario: Download CV access control
- **WHEN** unauthenticated user attempts to download CV
- **THEN** system denies access (401 Unauthorized)
- **AND** file is not downloaded

#### Scenario: Download CV for assigned candidate
- **WHEN** user downloads CV for candidate assigned to them
- **THEN** system allows download
- **AND** file is retrieved and downloaded successfully

#### Scenario: Download CV for unassigned candidate
- **WHEN** Owner or Manager downloads CV for unassigned candidate
- **THEN** system allows download
- **AND** file is retrieved and downloaded successfully

#### Scenario: Admin download CV
- **WHEN** Admin downloads candidate CV
- **THEN** system allows download
- **AND** file is retrieved and downloaded successfully

### Requirement: CV metadata tracking
The system SHALL track metadata for uploaded CV/resume files.

#### Scenario: Store CV metadata
- **WHEN** CV file is uploaded
- **THEN** system stores metadata: originalFilename, fileSize, mimeType, storagePath, uploadedAt, uploadedBy
- **AND** metadata is linked to candidate record
- **AND** metadata is queryable for reporting and management

#### Scenario: View CV metadata
- **WHEN** user views candidate detail page
- **THEN** system displays CV metadata: filename, file size, upload date, uploaded by
- **AND** user can download CV from metadata display

#### Scenario: CV metadata history
- **WHEN** candidate has multiple CV uploads
- **THEN** system maintains history of CV metadata
- **AND** user can view previous CV versions if configured
- **AND** system tracks which CV is current

### Requirement: CV file management
The system SHALL provide file management operations for CV/resume files.

#### Scenario: Delete CV file
- **WHEN** Owner or Manager deletes candidate CV
- **THEN** system removes file from Google Cloud Storage
- **AND** system removes CV metadata from database
- **AND** candidate record is updated to reflect no CV

#### Scenario: Delete CV access control
- **WHEN** Admin attempts to delete CV
- **THEN** system denies action (403 Forbidden)
- **AND** CV file is not deleted

#### Scenario: Handle storage errors
- **WHEN** system encounters storage error (network failure, permission issue, bucket not found)
- **THEN** system returns appropriate error message
- **AND** system logs error for debugging
- **AND** user is notified of failure

### Requirement: CV storage security
The system SHALL ensure CV/resume files are stored securely with appropriate access controls.

#### Scenario: Files are private
- **WHEN** CV files are stored in Google Cloud Storage
- **THEN** files are stored with private access permissions
- **AND** files are not publicly accessible via direct URL
- **AND** files require authentication to access

#### Scenario: Secure file access
- **WHEN** user accesses CV file
- **THEN** system verifies user authentication
- **AND** system verifies user has permission to view candidate
- **AND** system generates temporary signed URL if needed for secure access

#### Scenario: File path security
- **WHEN** system generates file storage paths
- **THEN** paths do not expose sensitive information
- **AND** paths use UUIDs or hashed identifiers
- **AND** paths prevent directory traversal attacks

### Requirement: CV storage integration
The system SHALL integrate with Google Cloud Storage for file operations.

#### Scenario: Initialize storage client
- **WHEN** system starts up
- **THEN** system initializes Google Cloud Storage client with credentials
- **AND** system verifies bucket exists and is accessible
- **AND** system handles initialization errors gracefully

#### Scenario: Storage operations use SDK
- **WHEN** system performs storage operations
- **THEN** system uses Google Cloud Storage SDK
- **AND** operations handle network timeouts and retries
- **AND** operations provide error handling and logging
