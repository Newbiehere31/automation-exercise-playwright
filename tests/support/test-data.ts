import type { TestInfo } from '@playwright/test';

export type AccountData = {
  name: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
};

export function createAccountData(testInfo: TestInfo, label: string): AccountData {
  const safeLabel = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const safeProject = testInfo.project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const uniqueId = `${safeLabel}-${safeProject}-${Date.now()}`;

  return {
    name: `${label} ${testInfo.project.name}`,
    email: `exploringworld678+${uniqueId}@gmail.com`,
    password: 'Test@12345',
    firstName: 'Exploring',
    lastName: 'World',
    company: 'Test Automation',
    address: '123 Test Street',
    address2: 'Suite 456',
    country: 'United States',
    state: 'California',
    city: 'Los Angeles',
    zipcode: '90001',
    mobileNumber: '1234567890'
  };
}
