## ADDED Requirements

### Requirement: User registration
The system SHALL allow users to register by providing email, password, and name.

#### Scenario: Successful registration
- **WHEN** user submits registration form with valid email, password (8+ characters), and name
- **THEN** system creates user account with status PENDING
- **AND** password is hashed using bcrypt
- **AND** user is redirected to pending approval page
- **AND** email is stored in database

#### Scenario: Registration with duplicate email
- **WHEN** user attempts to register with email that already exists
- **THEN** system returns error message "Email already registered"
- **AND** account is not created

#### Scenario: Registration with weak password
- **WHEN** user attempts to register with password less than 8 characters
- **THEN** system returns validation error
- **AND** account is not created

### Requirement: Password hashing
The system SHALL hash all passwords using bcrypt before storing in database.

#### Scenario: Password storage
- **WHEN** user registers or changes password
- **THEN** password is hashed with bcrypt (10 rounds)
- **AND** plain text password is never stored in database

#### Scenario: Password verification
- **WHEN** user attempts to login
- **THEN** system compares provided password with stored hash using bcrypt
- **AND** login succeeds only if password matches

### Requirement: User login
The system SHALL authenticate users with email and password.

#### Scenario: Successful login
- **WHEN** user provides valid email and password for ACTIVE account
- **THEN** system creates NextAuth session
- **AND** session includes user id, email, name, and role
- **AND** user is redirected to dashboard or intended page

#### Scenario: Login with invalid credentials
- **WHEN** user provides incorrect email or password
- **THEN** system returns error "Invalid email or password"
- **AND** session is not created

#### Scenario: Login with pending account
- **WHEN** user attempts to login with PENDING status account
- **THEN** system returns error "Account pending approval"
- **AND** session is not created

#### Scenario: Login with rejected account
- **WHEN** user attempts to login with REJECTED status account
- **THEN** system returns error "Account registration was rejected"
- **AND** session is not created

#### Scenario: Login with suspended account
- **WHEN** user attempts to login with SUSPENDED status account
- **THEN** system returns error "Account is suspended"
- **AND** session is not created

### Requirement: Session management
The system SHALL maintain user session with role information.

#### Scenario: Session creation
- **WHEN** user successfully logs in
- **THEN** NextAuth session is created
- **AND** session.user contains: id, email, name, role
- **AND** session persists across page navigation

#### Scenario: Session access
- **WHEN** application code accesses session
- **THEN** session data is available in Server Components and API routes
- **AND** role information is accessible for RBAC checks

#### Scenario: Session expiration
- **WHEN** session expires
- **THEN** user is redirected to sign-in page
- **AND** user must login again

### Requirement: Sign-in page
The system SHALL provide a sign-in page for user authentication.

#### Scenario: Sign-in page display
- **WHEN** user navigates to `/auth/signin`
- **THEN** sign-in form is displayed with email and password fields
- **AND** form uses shadcn/ui components
- **AND** form includes submit button

#### Scenario: Sign-in form submission
- **WHEN** user submits sign-in form
- **THEN** form validates email format
- **AND** form validates password is provided
- **AND** authentication request is sent to NextAuth

### Requirement: Sign-up page
The system SHALL provide a sign-up page for user registration.

#### Scenario: Sign-up page display
- **WHEN** user navigates to `/auth/signup`
- **THEN** registration form is displayed with email, password, and name fields
- **AND** form uses shadcn/ui components
- **AND** form includes submit button

#### Scenario: Sign-up form validation
- **WHEN** user submits sign-up form
- **THEN** system validates email format
- **THEN** system validates password is 8+ characters
- **THEN** system validates name is provided
- **AND** form shows validation errors if invalid

#### Scenario: Sign-up form submission
- **WHEN** user submits valid sign-up form
- **THEN** registration request is processed
- **AND** user is redirected to pending approval page

### Requirement: Database-backed authentication
The system SHALL authenticate users against database records, not hardcoded values.

#### Scenario: Authentication lookup
- **WHEN** user attempts to login
- **THEN** system queries User model in database by email
- **AND** system verifies password against stored hash
- **AND** hardcoded authentication logic is not used
