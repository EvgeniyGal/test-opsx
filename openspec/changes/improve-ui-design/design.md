## Context

The application currently has a visual inconsistency between the premium authentication pages (sign-in, sign-up) and the rest of the authenticated application. Auth pages feature gradient backgrounds (`from-blue-600 via-blue-700 to-indigo-800`), enhanced shadows (`shadow-xl`, `shadow-lg`), decorative blurred shapes, smooth transitions, and polished styling. In contrast, authenticated pages use basic shadcn/ui components with minimal styling - cards use `rounded-xl shadow`, buttons are flat, inputs have basic borders, and pages lack visual depth.

**Current State:**
- Auth pages: Premium design with gradients, shadows, decorative elements, smooth animations
- Authenticated pages: Basic styling with minimal visual interest
- Components: Standard shadcn/ui styling without enhancements
- No consistent design system or visual hierarchy

**Constraints:**
- Must use existing Tailwind CSS v4 utilities (no custom CSS)
- Must maintain shadcn/ui component structure (enhance, don't replace)
- Must work with Next.js 15 App Router (Server and Client Components)
- Must maintain accessibility (contrast, focus states)
- Must be responsive across all viewports
- No breaking changes to component APIs

**Stakeholders:**
- End users: Expect consistent, premium experience
- Developers: Need maintainable, consistent styling approach

## Goals / Non-Goals

**Goals:**
- Create visual consistency between auth pages and authenticated application
- Enhance UI components with gradients, shadows, and decorative elements matching auth pages
- Establish reusable design tokens and patterns
- Improve visual hierarchy and depth throughout the application
- Implement theme switching (light/dark) with manual and system preference support
- Maintain component API compatibility (no breaking changes)
- Ensure all enhancements are responsive and accessible

**Non-Goals:**
- Redesign component structure or functionality
- Create custom CSS or new design system library
- Change component APIs or props
- Add new dependencies
- Modify database or API layer
- Change functional behavior (purely visual enhancements)

## Decisions

### 1. Design Token Implementation: Tailwind Utility Classes

**Decision:** Use Tailwind CSS utility classes directly in components rather than creating a separate design token system or CSS variables.

**Rationale:**
- Tailwind utilities are already available and well-integrated
- No need for additional abstraction layer
- Matches existing codebase patterns (auth pages use utilities directly)
- Easy to maintain and modify
- No build-time overhead

**Alternatives Considered:**
- CSS variables for design tokens: Rejected - adds complexity, Tailwind utilities are sufficient
- Separate design system package: Rejected - overkill for this scope, utilities work well
- Custom CSS classes: Rejected - goes against Tailwind philosophy, harder to maintain

**Implementation:**
- Define design tokens as documented Tailwind class combinations
- Apply consistently across components
- Document in component comments or design system spec

### 2. Component Enhancement Strategy: Enhance Existing Components

**Decision:** Enhance existing shadcn/ui components by modifying their className props and adding new variants, rather than creating wrapper components.

**Rationale:**
- Maintains component API compatibility
- No breaking changes for existing usage
- Leverages existing component structure
- Easier to maintain (single source of truth)
- Follows shadcn/ui patterns (components are meant to be customized)

**Alternatives Considered:**
- Wrapper components: Rejected - adds unnecessary abstraction, harder to maintain
- Separate enhanced component library: Rejected - creates duplication, maintenance burden
- Global CSS overrides: Rejected - harder to control, less explicit

**Implementation:**
- Modify `components/ui/card.tsx` to use `rounded-2xl shadow-xl` by default
- Add `gradient` variant to `components/ui/button.tsx`
- Enhance `components/ui/input.tsx` with `border-2 focus:border-primary`
- Update component usage in pages/components to apply new styling

### 3. Gradient Application: Subtle and Strategic

**Decision:** Apply gradients strategically - use subtle gradients for backgrounds (`bg-gradient-to-br from-gray-50 to-gray-100`), stronger gradients for buttons and accents, avoid overwhelming content.

**Rationale:**
- Subtle backgrounds maintain readability
- Strong gradients on buttons provide clear call-to-action
- Matches authentication page approach
- Prevents visual fatigue
- Maintains professional appearance

**Alternatives Considered:**
- Heavy gradients everywhere: Rejected - overwhelming, reduces readability
- No gradients: Rejected - doesn't match auth pages, misses opportunity for consistency
- Gradient overlays: Considered but rejected - adds complexity, subtle backgrounds work better

**Implementation:**
- Page backgrounds: `bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`
- Buttons: `bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700`
- Header/Sidebar accents: Subtle gradient borders or backgrounds where appropriate

### 4. Shadow System: Layered Depth

**Decision:** Use three-tier shadow system: `shadow-lg` for secondary elements, `shadow-xl` for primary cards, `shadow-2xl` for modals/overlays and hover states.

**Rationale:**
- Creates clear visual hierarchy
- Matches authentication page shadow usage
- Provides depth without being overwhelming
- Standard Tailwind shadow scale
- Easy to apply consistently

**Alternatives Considered:**
- Single shadow level: Rejected - lacks hierarchy, flat appearance
- Custom shadow values: Rejected - Tailwind defaults work well, no need for custom
- No shadows: Rejected - flat appearance, doesn't match auth pages

**Implementation:**
- Cards: `shadow-xl hover:shadow-2xl transition-shadow`
- Buttons: `shadow-lg hover:shadow-xl`
- Modals/Sheets: `shadow-2xl`
- Header/Footer: `shadow-lg`

### 5. Decorative Elements: Subtle and Non-Intrusive

**Decision:** Add decorative blurred shapes (`bg-white rounded-full blur-3xl opacity-10`) to key pages (dashboard, main content areas) positioned to add visual interest without distraction.

**Rationale:**
- Matches authentication page decorative approach
- Adds visual interest without overwhelming content
- Low opacity ensures readability
- Blurred shapes are subtle and professional
- Can be positioned strategically

**Alternatives Considered:**
- No decorative elements: Rejected - misses opportunity to match auth pages
- Heavy decorations: Rejected - distracting, reduces focus on content
- Animated decorations: Considered but rejected - adds complexity, static is sufficient

**Implementation:**
- Add decorative divs with `absolute` positioning
- Use `opacity-10` or `opacity-5` for subtlety
- Position in corners or edges (`top-0 left-0`, `bottom-0 right-0`)
- Ensure z-index doesn't interfere with content

### 6. Border Radius: Consistent Scale

**Decision:** Use `rounded-2xl` for primary cards/containers, `rounded-xl` for secondary elements, matching authentication pages.

**Rationale:**
- Matches authentication page border radius usage
- Creates visual consistency
- `rounded-2xl` provides modern, soft appearance
- Standard Tailwind scale, no custom values needed
- Easy to apply consistently

**Alternatives Considered:**
- Single border radius: Rejected - lacks visual variety
- Custom border radius values: Rejected - Tailwind defaults work well
- Smaller radius (`rounded-lg`): Rejected - doesn't match auth pages, less modern

**Implementation:**
- Cards: `rounded-2xl`
- Buttons: `rounded-xl` (or `rounded-md` for smaller buttons)
- Inputs: `rounded-md` (maintains usability)
- Containers: `rounded-2xl` for main containers

### 7. Button Gradient Variant: New Variant Addition

**Decision:** Add a new `gradient` variant to the Button component using class-variance-authority, matching authentication page button styling.

**Rationale:**
- Maintains component API (existing variants unchanged)
- Easy to use (`variant="gradient"`)
- Follows shadcn/ui pattern (variants via CVA)
- Matches authentication page buttons exactly
- No breaking changes

**Alternatives Considered:**
- Modify default variant: Rejected - breaking change, affects all buttons
- Wrapper component: Rejected - unnecessary abstraction
- Inline styles: Rejected - not maintainable, doesn't follow patterns

**Implementation:**
- Add `gradient` variant to `buttonVariants` CVA definition
- Use: `bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl`
- Apply to primary action buttons throughout the app

### 8. Input Enhancement: Border and Focus States

**Decision:** Enhance Input component with `border-2` for better visibility and `focus:border-primary` for clear focus indication, matching authentication form inputs.

**Rationale:**
- Matches authentication page input styling
- Better visibility with `border-2`
- Clear focus indication improves accessibility
- Smooth transitions enhance UX
- No breaking changes (additive styling)

**Alternatives Considered:**
- Keep current border: Rejected - doesn't match auth pages, less visible
- Custom focus ring: Considered but `focus:border-primary` is simpler and matches auth
- No changes: Rejected - inconsistency with auth pages

**Implementation:**
- Update Input component default className to include `border-2 focus:border-primary transition-colors`
- Ensure icon integration (like auth forms) where applicable
- Maintain existing functionality and API

### 9. Transition Timing: Consistent Animation Speed

**Decision:** Use `transition-all duration-200` for smooth, consistent animations across all interactive elements.

**Rationale:**
- Matches authentication page transition timing
- `duration-200` (200ms) is fast enough to feel responsive, slow enough to be noticeable
- `transition-all` covers all property changes
- Consistent timing creates cohesive feel
- Standard Tailwind timing, no custom values

**Alternatives Considered:**
- Faster transitions (`duration-100`): Rejected - too fast, may be missed
- Slower transitions (`duration-300`): Rejected - feels sluggish
- No transitions: Rejected - jarring, doesn't match auth pages
- Custom timing: Rejected - Tailwind defaults work well

**Implementation:**
- Apply `transition-all duration-200` to buttons, cards, inputs
- Use `transition-shadow` for shadow-only transitions where appropriate
- Ensure all interactive elements have smooth transitions

### 10. Page Background Strategy: Gradient Backgrounds

**Decision:** Apply subtle gradient backgrounds (`bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`) to main content areas (dashboard, pages) matching authentication page backgrounds.

**Rationale:**
- Matches authentication page background approach
- Subtle gradients add visual interest without distraction
- Dark mode support maintains consistency
- Creates cohesive experience
- Easy to apply at page level

**Alternatives Considered:**
- Solid backgrounds: Rejected - doesn't match auth pages, less interesting
- Heavy gradients: Rejected - overwhelming, reduces readability
- Pattern backgrounds: Considered but rejected - gradients are simpler and match auth

**Implementation:**
- Apply gradient background to main content containers
- Use in `app/dashboard/page.tsx` and other main pages
- Ensure contrast with content (cards, text)

### 11. Theme Switching: Manual and System Preference

**Decision:** Implement theme switching using `next-themes` library with support for manual selection (light/dark) and system preference detection, with theme toggle in header/sidebar.

**Rationale:**
- `next-themes` is the standard solution for Next.js theme switching
- Provides SSR-safe theme switching (no flash of wrong theme)
- Supports system preference detection via `prefers-color-scheme`
- Allows manual override of system preference
- Persists user preference in localStorage
- Easy to integrate with Tailwind's dark mode

**Alternatives Considered:**
- Custom theme implementation: Rejected - reinventing wheel, `next-themes` is battle-tested
- CSS-only dark mode: Rejected - no manual control, no system preference detection
- No theme switching: Rejected - users expect theme control, improves UX

**Implementation:**
- Install `next-themes` package
- Create `components/providers/ThemeProvider.tsx` wrapping `ThemeProvider` from `next-themes`
- Configure with `attribute="class"` and `enableSystem={true}`
- Add theme toggle component (Sun/Moon icons) to header or sidebar
- Update `app/layout.tsx` to include ThemeProvider
- Ensure all components use `dark:` variants for dark mode support

## Risks / Trade-offs

### [Risk] Performance Impact from Multiple Gradients and Shadows
**Mitigation:** Tailwind CSS utilities are optimized and generate minimal CSS. Gradients and shadows are GPU-accelerated. Monitor bundle size - should be minimal impact. Use Tailwind's purge/JIT to remove unused styles.

### [Risk] Visual Overload
**Mitigation:** Use gradients and decorations subtly. Test with real content. Ensure readability is maintained. Follow authentication page patterns which balance visual interest with usability.

### [Risk] Dark Mode Consistency
**Mitigation:** Ensure all gradients and colors have dark mode variants. Test dark mode thoroughly. Use Tailwind's `dark:` prefix consistently. Match authentication page dark mode approach. Implement comprehensive theme switching to allow users to test both modes.

### [Risk] Theme Switching Flash of Wrong Theme
**Mitigation:** Use `next-themes` with proper SSR configuration (`attribute="class"`, `enableSystem={true}`). Ensure ThemeProvider wraps the entire app. Use `suppressHydrationWarning` on html element if needed. Test initial load and theme switching.

### [Risk] Component API Drift
**Mitigation:** Only enhance styling, don't change component APIs. All changes are additive (new variants, enhanced defaults). Existing usage continues to work. Document new variants clearly.

### [Risk] Maintenance Burden
**Mitigation:** Use Tailwind utilities (not custom CSS) for easy maintenance. Document design tokens clearly. Create consistent patterns that are easy to follow. Keep changes localized to component files.

### [Trade-off] Enhanced Styling vs. Bundle Size
**Trade-off:** Enhanced styling adds Tailwind utility classes but Tailwind's JIT compiler only includes used classes. **Decision:** Accept minimal bundle size increase for significant visual improvement. Monitor and optimize if needed.

### [Trade-off] Visual Consistency vs. Flexibility
**Trade-off:** Strict design system limits flexibility but ensures consistency. **Decision:** Establish clear design tokens and patterns while allowing component-level customization when needed. Balance consistency with practical needs.

### [Trade-off] Enhancement Scope
**Trade-off:** Enhancing all components vs. focusing on key areas. **Decision:** Enhance all components systematically to ensure full consistency. Prioritize navigation, dashboard, and frequently-used components first.

## Migration Plan

### Phase 1: Theme Switching Implementation
1. Install `next-themes` package
2. Create `components/providers/ThemeProvider.tsx` with `next-themes` ThemeProvider
3. Configure ThemeProvider with `attribute="class"`, `enableSystem={true}`, `storageKey="theme"`
4. Update `app/layout.tsx` to wrap with ThemeProvider
5. Create `components/ui/ThemeToggle.tsx` with Sun/Moon icons for theme switching
6. Add ThemeToggle to header or sidebar
7. Test theme switching (light, dark, system)
8. Test theme persistence across page reloads

### Phase 2: Design Token Documentation
1. Document design tokens (gradients, shadows, border radius, transitions) in a reference document
2. Document dark mode variants for all design tokens
3. Create examples showing before/after styling
4. Review with team/stakeholders

### Phase 2: Core UI Component Enhancements
1. Enhance `components/ui/card.tsx` - update default styling to `rounded-2xl shadow-xl`
2. Enhance `components/ui/button.tsx` - add `gradient` variant
3. Enhance `components/ui/input.tsx` - add `border-2 focus:border-primary`
4. Test components in isolation

### Phase 3: Navigation Component Enhancements
1. Enhance `components/layout/Header.tsx` - add gradient accents, enhanced shadows
2. Enhance `components/layout/Sidebar.tsx` - improve hover states, add shadows
3. Enhance `components/layout/Footer.tsx` - add subtle decorative elements
4. Test navigation across all viewports

### Phase 4: Page-Level Enhancements
1. Enhance `app/dashboard/page.tsx` - add gradient background, enhance cards
2. Add decorative elements to dashboard
3. Apply gradient backgrounds to other main pages
4. Test page layouts

### Phase 5: List and Table Enhancements
1. Enhance `components/clients/ClientList.tsx` - improve card and table styling
2. Enhance `components/auth/UsersTable.tsx` - improve card and table styling
3. Ensure responsive behavior maintained
4. Test filtering and interactions

### Phase 6: Form and Input Enhancements
1. Review all form components for input styling consistency
2. Ensure icon integration matches authentication forms
3. Test form interactions and focus states
4. Verify accessibility (contrast, focus indicators)

### Phase 7: Testing and Refinement
1. Test across all viewports (mobile, tablet, desktop)
2. Test dark mode thoroughly
3. Verify accessibility (WCAG contrast ratios, focus states)
4. Performance testing (bundle size, render performance)
5. User testing for visual consistency

### Rollback Strategy
- All changes are CSS/styling only - easy to revert
- Component APIs unchanged - no breaking changes
- Can revert individual components if issues arise
- Git history preserves previous versions
- Can rollback incrementally (component by component)

## Open Questions

1. **Gradient Intensity:** Should header/sidebar have subtle gradient backgrounds or just accents? (Recommendation: Start with accents, add backgrounds if needed)

2. **Decorative Element Placement:** Where exactly should blurred shapes be positioned? (Recommendation: Follow auth page pattern - corners and edges)

3. **Button Gradient Usage:** Which buttons should use gradient variant vs. default? (Recommendation: Primary actions use gradient, secondary use default/outline)

4. **Dark Mode Gradients:** Should dark mode use different gradient colors or just darker versions? (Recommendation: Use darker versions of same gradients for consistency)

5. **Theme Toggle Placement:** Where should theme toggle be located - header, sidebar, or both? (Recommendation: Header for easy access, visible on all pages)

6. **System Preference Handling:** Should system preference be the default, or should manual selection override immediately? (Recommendation: System preference as default, manual selection persists)

5. **Animation Preferences:** Should hover effects include scale transforms or just shadow/color changes? (Recommendation: Start with shadow/color, add scale if needed for emphasis)

6. **Card Hover Effects:** Should cards lift on hover (transform) or just enhance shadow? (Recommendation: Start with shadow enhancement, add transform if desired)

7. **Consistency Scope:** Should all pages get gradient backgrounds or just main pages? (Recommendation: Start with dashboard and main pages, expand if desired)
