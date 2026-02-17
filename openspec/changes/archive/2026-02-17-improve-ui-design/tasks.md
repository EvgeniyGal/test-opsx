# Tasks

## Phase 1: Theme Switching Implementation

- [x] Install `next-themes` package
- [x] Create `components/providers/ThemeProvider.tsx` with `next-themes` ThemeProvider
- [x] Configure ThemeProvider with `attribute="class"`, `enableSystem={true}`, `storageKey="theme"`
- [x] Update `app/layout.tsx` to wrap with ThemeProvider
- [x] Create `components/ui/ThemeToggle.tsx` with Sun/Moon icons for theme switching
- [x] Add ThemeToggle to header (in `components/layout/Header.tsx` or `HeaderWithMobileMenu.tsx`)
- [x] Test theme switching (light, dark, system)
- [x] Test theme persistence across page reloads

## Phase 2: Core UI Component Enhancements

- [x] Enhance `components/ui/card.tsx` - update default styling to `rounded-2xl shadow-xl`
- [x] Add hover effect to cards: `hover:shadow-2xl transition-shadow`
- [x] Enhance `components/ui/button.tsx` - add `gradient` variant using CVA
- [x] Gradient variant: `bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl`
- [x] Enhance `components/ui/input.tsx` - add `border-2 focus:border-primary transition-colors` to default className
- [x] Test components in isolation

## Phase 3: Navigation Component Enhancements

- [x] Enhance `components/layout/Header.tsx` - add enhanced shadow (`shadow-lg`)
- [x] Enhance `components/layout/Sidebar.tsx` - improve hover states with `transition-colors`
- [x] Add enhanced shadow (`shadow-lg`) to sidebar
- [x] Enhance `components/layout/Footer.tsx` - add enhanced shadow (`shadow-lg`)
- [x] Test navigation across all viewports (mobile, tablet, desktop)

## Phase 4: Page-Level Enhancements

- [x] Enhance `app/dashboard/page.tsx` - add gradient background (`bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`)
- [x] Add decorative blurred shapes to dashboard (optional, matching auth pages)
- [x] Ensure dashboard cards use enhanced styling (`rounded-2xl shadow-xl`)
- [x] Apply gradient backgrounds to other main pages (clients, admin pages)
- [x] Test page layouts across viewports

## Phase 5: List and Table Enhancements

- [x] Enhance `components/clients/ClientList.tsx` - ensure cards use `rounded-2xl shadow-xl`
- [x] Add hover effects to cards in ClientList (`hover:shadow-2xl transition-shadow`)
- [x] Enhance `components/auth/UsersTable.tsx` - ensure cards use `rounded-2xl shadow-xl`
- [x] Add hover effects to cards in UsersTable (`hover:shadow-2xl transition-shadow`)
- [x] Ensure responsive behavior maintained (cards on mobile, table on desktop)
- [x] Test filtering and interactions

## Phase 6: Form and Input Enhancements

- [x] Review all form components for input styling consistency
- [x] Ensure all inputs have `border-2 focus:border-primary transition-colors`
- [x] Ensure icon integration matches authentication forms where applicable
- [x] Test form interactions and focus states
- [x] Verify accessibility (contrast, focus indicators)

## Phase 7: Testing and Refinement

- [x] Test across all viewports (mobile, tablet, desktop)
- [x] Test dark mode thoroughly (all components, all pages)
- [x] Verify accessibility (WCAG contrast ratios, focus states)
- [x] Performance testing (bundle size, render performance)
- [x] Visual consistency check (compare with auth pages)
