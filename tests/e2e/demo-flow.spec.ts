import { test, expect } from '@playwright/test';

/**
 * Demo flow E2E tests
 * 
 * These tests verify the public landing page and demo login flow.
 * Tests are designed to work without Supabase credentials.
 */

test.describe('Public Landing Page', () => {
  test('should display SINAD+ branding and main content', async ({ page }) => {
    await page.goto('/');
    
    // Verify SINAD+ branding is present
    await expect(page.locator('text=SINAD+').first()).toBeVisible();
    
    // Verify main heading
    await expect(page.locator('h1')).toContainText('Pendampingan Awal');
    await expect(page.locator('h1')).toContainText('Perkembangan Anak');
    
    // Verify CTA button exists
    const ctaButton = page.locator('a[href="/login"]', { hasText: 'Coba Demo' }).first();
    await expect(ctaButton).toBeVisible();
  });

  test('should have accessible navigation on desktop', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop-specific test');
    
    await page.goto('/');
    
    // Verify main content is visible
    await expect(page.locator('main')).toBeVisible();
    
    // Verify features section
    await expect(page.locator('text=Fitur Utama')).toBeVisible();
    await expect(page.locator('text=Skrining Awal')).toBeVisible();
    await expect(page.locator('text=Aktivitas Terstruktur')).toBeVisible();
    await expect(page.locator('text=Laporan Konsultasi')).toBeVisible();
  });

  test('should be mobile-responsive', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-specific test');
    
    await page.goto('/');
    
    // Verify main heading is visible on mobile
    await expect(page.locator('h1')).toBeVisible();
    
    // Verify CTA button is visible and accessible on mobile
    const ctaButton = page.locator('a[href="/login"]', { hasText: 'Coba Demo' }).first();
    await expect(ctaButton).toBeVisible();
    
    // Verify features section is visible
    await expect(page.locator('text=Fitur Utama')).toBeVisible();
  });
});

test.describe('Demo Login Flow', () => {
  test('should navigate to demo login page and display login button', async ({ page }) => {
    await page.goto('/');
    
    // Click on "Coba Demo" or "Masuk Demo" link
    const demoLink = page.locator('a[href="/login"]', { hasText: 'Coba Demo' }).first();
    await demoLink.click();
    
    // Wait for navigation to login page
    await page.waitForURL('**/login');
    
    // Verify we're on the demo login page
    await expect(page.locator('text=Demo SINAD+')).toBeVisible();
    
    // Verify login button is visible
    const loginButton = page.locator('button[type="submit"]', { hasText: 'Masuk Demo' });
    await expect(loginButton).toBeVisible();
    
    // Verify demo information is displayed
    await expect(page.locator('text=Tentang Data Demo')).toBeVisible();
  });

  test('should display demo information correctly', async ({ page }) => {
    await page.goto('/login');
    
    // Verify demo page title
    await expect(page.locator('text=Demo SINAD+')).toBeVisible();
    
    // Verify demo description
    await expect(page.locator('text=Masuk ke akun demo')).toBeVisible();
    
    // Verify demo data information points
    await expect(page.locator('text=Semua data bersifat fiktif')).toBeVisible();
    await expect(page.locator('text=Data direset secara berkala')).toBeVisible();
    
    // Verify submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });
});
