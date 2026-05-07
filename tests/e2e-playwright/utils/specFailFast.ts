import { test } from '@playwright/test';

export function configureSpecFailFast() {
  test.describe.configure({ mode: 'serial', retries: 0 });
}
