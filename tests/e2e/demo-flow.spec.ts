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
    await expect(page.locator('h1')).toContainText('Ubah catatan kecil');
    await expect(page.locator('h1')).toContainText('bekal konsultasi');

    // Verify CTA button exists
    const ctaButton = page.locator('a[href="/login"]', { hasText: 'Masuk Demo' }).first();
    await expect(ctaButton).toBeVisible();
  });

  test('should have accessible navigation on desktop', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop-specific test');
    
    await page.goto('/');
    
    // Verify main content is visible
    await expect(page.locator('main')).toBeVisible();
    
    // Verify product flow section
    await expect(page.locator('text=Alur produk')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Skrining Awal', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Aktivitas Bermain Terstruktur' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Laporan Konsultasi', exact: true })).toBeVisible();
  });

  test('should be mobile-responsive', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-specific test');
    
    await page.goto('/');
    
    // Verify main heading is visible on mobile
    await expect(page.locator('h1')).toBeVisible();
    
    // Verify CTA button is visible and accessible on mobile
    const ctaButton = page.locator('a[href="/login"]', { hasText: 'Masuk Demo' }).first();
    await expect(ctaButton).toBeVisible();

    // Verify flow section is visible
    await expect(page.locator('text=Alur produk')).toBeVisible();
  });
});

test.describe('Demo Login Flow', () => {
  test('should navigate to demo login page and display login button', async ({ page }) => {
    await page.goto('/');

    // Click on "Masuk Demo" link
    const demoLink = page.locator('a[href="/login"]', { hasText: 'Masuk Demo' }).first();
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

test.describe('App Form Widgets', () => {
  test('custom select options remain clickable above rating controls', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Masuk Demo' }).click();
    await page.waitForURL('**/dashboard');
    await page.getByRole('link', { name: 'Catatan' }).click();

    await page.getByRole('button', { name: 'Pilih suasana hati' }).click();
    await page.getByRole('option', { name: 'Netral' }).click();

    await expect(page.getByRole('button', { name: 'Netral' })).toBeVisible();
  });
});

test.describe('SINAD+ Branding', () => {
  test('uses the provided logo on login and authenticated shell', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('img', { name: 'Logo SINAD+' }).first()).toBeVisible();

    await page.getByRole('button', { name: 'Masuk Demo' }).click();
    await page.waitForURL('**/dashboard');

    await expect(page.getByRole('img', { name: 'Logo SINAD+' }).first()).toBeVisible();
  });
});
