# UI Design System

## Purpose

The UI Design System capability establishes a cohesive visual design system with gradient themes, enhanced shadows, decorative elements, and consistent styling patterns. It defines design tokens and patterns that can be applied across all UI components to maintain visual consistency with the premium authentication page aesthetic.

## Requirements

### Requirement: Design system color palette
The system SHALL use a consistent color palette with gradient themes matching the authentication pages throughout the application.

#### Scenario: Primary gradient theme applied
- **WHEN** user views any authenticated page
- **THEN** system uses primary gradient theme (`from-blue-600 via-blue-700 to-indigo-800`) for key visual elements
- **AND** gradient colors are consistent with authentication pages
- **AND** gradient theme is applied to headers, buttons, and decorative elements

#### Scenario: Secondary gradient theme available
- **WHEN** system needs to differentiate secondary elements
- **THEN** system uses secondary gradient theme (`from-indigo-600 via-purple-700 to-pink-800`)
- **AND** secondary gradient is used for alternative actions or accent elements

### Requirement: Enhanced shadow system
The system SHALL use consistent shadow levels to create visual depth and hierarchy.

#### Scenario: Shadow levels applied consistently
- **WHEN** user views cards, buttons, or elevated elements
- **THEN** system applies shadow levels: `shadow-xl` for primary cards, `shadow-lg` for secondary elements, `shadow-2xl` for modals/overlays
- **AND** shadows create visual depth and hierarchy
- **AND** shadow intensity matches authentication page styling

#### Scenario: Hover shadow enhancement
- **WHEN** user hovers over interactive elements (cards, buttons)
- **THEN** system enhances shadow (e.g., `hover:shadow-2xl` from `shadow-xl`)
- **AND** shadow transition is smooth (`transition-shadow`)
- **AND** enhancement provides visual feedback

### Requirement: Decorative background elements
The system SHALL include subtle decorative elements (gradients, blurred shapes) on key pages for visual interest.

#### Scenario: Decorative gradients on pages
- **WHEN** user views dashboard or main content pages
- **THEN** system displays subtle gradient backgrounds (`bg-gradient-to-br from-gray-50 to-gray-100`)
- **AND** gradients are subtle and do not interfere with content readability
- **AND** gradients match the aesthetic of authentication pages

#### Scenario: Blurred shape decorations
- **WHEN** system displays decorative elements
- **THEN** system uses blurred circular shapes (`bg-white rounded-full blur-3xl`) with low opacity
- **AND** decorations are positioned to add visual interest without distraction
- **AND** decorations use opacity levels consistent with auth pages (e.g., `opacity-10`)

### Requirement: Enhanced border radius consistency
The system SHALL use consistent border radius values matching authentication pages.

#### Scenario: Border radius applied consistently
- **WHEN** user views cards, buttons, or rounded elements
- **THEN** system uses `rounded-2xl` for primary cards and containers
- **AND** system uses `rounded-xl` for secondary elements and buttons
- **AND** border radius values match authentication page styling

### Requirement: Backdrop blur effects
The system SHALL use backdrop blur effects for glassmorphism styling where appropriate.

#### Scenario: Backdrop blur on overlay elements
- **WHEN** system displays elements with semi-transparent backgrounds
- **THEN** system applies `backdrop-blur-sm` for glassmorphism effect
- **AND** blur effect is subtle and enhances visual appeal
- **AND** blur is used consistently with authentication page patterns

### Requirement: Smooth transitions and animations
The system SHALL apply smooth transitions to interactive elements for a polished user experience.

#### Scenario: Transition timing consistency
- **WHEN** user interacts with buttons, cards, or other interactive elements
- **THEN** system applies `transition-all duration-200` for smooth state changes
- **AND** transitions are consistent across all interactive elements
- **AND** transition timing matches authentication page interactions

#### Scenario: Hover state transitions
- **WHEN** user hovers over interactive elements
- **THEN** system smoothly transitions colors, shadows, and transforms
- **AND** transitions provide clear visual feedback
- **AND** transitions enhance without being distracting

### Requirement: Gradient button variant
The system SHALL provide a gradient button variant matching authentication page buttons.

#### Scenario: Gradient button displays
- **WHEN** user views primary action buttons
- **THEN** system displays buttons with gradient background (`bg-gradient-to-r from-blue-600 to-indigo-600`)
- **AND** gradient buttons have enhanced shadow (`shadow-lg hover:shadow-xl`)
- **AND** gradient buttons match authentication page button styling

#### Scenario: Gradient button hover state
- **WHEN** user hovers over gradient button
- **THEN** system darkens gradient (`hover:from-blue-700 hover:to-indigo-700`)
- **AND** shadow enhances (`hover:shadow-xl`)
- **AND** transition is smooth (`transition-all duration-200`)

### Requirement: Enhanced card styling
The system SHALL enhance card components with improved shadows, gradient borders, and hover effects.

#### Scenario: Card displays enhanced styling
- **WHEN** user views card components
- **THEN** cards use `rounded-2xl` border radius
- **AND** cards have enhanced shadow (`shadow-xl`)
- **AND** cards have smooth hover effects (`hover:shadow-2xl transition-shadow`)

#### Scenario: Card hover interaction
- **WHEN** user hovers over card
- **THEN** card shadow enhances (`hover:shadow-2xl`)
- **AND** card may have subtle scale or lift effect
- **AND** transition is smooth and provides visual feedback

### Requirement: Enhanced input styling
The system SHALL enhance form inputs with improved focus states, borders, and transitions matching authentication forms.

#### Scenario: Input displays enhanced styling
- **WHEN** user views form inputs
- **THEN** inputs have `border-2` for better visibility
- **AND** inputs have enhanced focus border color (`focus:border-primary`)
- **AND** inputs have smooth transitions (`transition-colors`)

#### Scenario: Input focus state
- **WHEN** user focuses on input field
- **THEN** input border color changes to primary color
- **AND** transition is smooth
- **AND** focus state matches authentication form inputs

### Requirement: Icon integration with styling
The system SHALL integrate icons with proper spacing and color transitions matching authentication pages.

#### Scenario: Icons display with proper styling
- **WHEN** user views elements with icons
- **THEN** icons have appropriate spacing (`gap-2`, `gap-4`)
- **AND** icons change color on interaction (`group-focus-within:text-primary`)
- **AND** icon color transitions are smooth (`transition-colors`)

### Requirement: Theme switching
The system SHALL provide theme switching functionality allowing users to manually select light or dark theme, or follow system preference.

#### Scenario: Theme toggle displays in navigation
- **WHEN** authenticated user views any authenticated page
- **THEN** system displays theme toggle button in header or sidebar
- **AND** toggle button shows current theme (Sun icon for light, Moon icon for dark)
- **AND** toggle button is easily accessible

#### Scenario: Manual theme selection
- **WHEN** user clicks theme toggle button
- **THEN** system switches between light and dark theme
- **AND** theme change applies immediately without page reload
- **AND** user preference is saved in localStorage
- **AND** theme persists across page reloads and sessions

#### Scenario: System preference detection
- **WHEN** user has not manually selected a theme
- **THEN** system detects system preference via `prefers-color-scheme` media query
- **AND** system applies light theme if system prefers light
- **AND** system applies dark theme if system prefers dark
- **AND** system preference is used as default

#### Scenario: Manual selection overrides system preference
- **WHEN** user manually selects a theme (light or dark)
- **THEN** manual selection overrides system preference
- **AND** manual selection persists until user changes it
- **AND** system preference is ignored while manual selection is active

#### Scenario: Theme applies to all components
- **WHEN** user switches theme
- **THEN** all components update to match selected theme
- **AND** gradients, shadows, and colors adapt appropriately
- **AND** dark mode variants (`dark:`) are applied when dark theme is active
- **AND** no flash of wrong theme occurs during page load

#### Scenario: Theme persists across sessions
- **WHEN** user selects a theme and reloads page
- **THEN** system remembers user's theme preference
- **AND** theme is applied immediately on page load
- **AND** no flash of default theme occurs before preference loads
