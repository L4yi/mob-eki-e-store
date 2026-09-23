import {
  IProductRepository,
  ICategoryRepository,
  IOrderRepository,
  IInventoryRepository,
  IPaymentRepository,
  IUserRepository,
  IAddressRepository,
  IAuditLogRepository,
  ISettingsRepository,
} from './interfaces';

import { JsonProductRepository } from './json/JsonProductRepository';
import { JsonCategoryRepository } from './json/JsonCategoryRepository';
import { JsonOrderRepository } from './json/JsonOrderRepository';
import { JsonInventoryRepository } from './json/JsonInventoryRepository';
import { JsonPaymentRepository } from './json/JsonPaymentRepository';
import { JsonUserRepository } from './json/JsonUserRepository';
import {
  JsonAddressRepository,
  JsonAuditLogRepository,
  JsonSettingsRepository,
} from './json/JsonSettingsAndOtherRepos';

import {
  SupabaseProductRepository,
  SupabaseCategoryRepository,
  SupabaseOrderRepository,
  SupabaseInventoryRepository,
  SupabasePaymentRepository,
  SupabaseUserRepository,
  SupabaseSettingsRepository,
  SupabaseAuditLogRepository,
} from './supabase/SupabaseRepositories';
import { getSupabaseClient } from '../lib/supabaseClient';

class RepositoryContainer {
  private static instance: RepositoryContainer;
  public productRepo: IProductRepository;
  public categoryRepo: ICategoryRepository;
  public orderRepo: IOrderRepository;
  public inventoryRepo: IInventoryRepository;
  public paymentRepo: IPaymentRepository;
  public userRepo: IUserRepository;
  public addressRepo: IAddressRepository;
  public auditLogRepo: IAuditLogRepository;
  public settingsRepo: ISettingsRepository;

  private constructor() {
    const { supabase, available: isSupabaseAvailable } = getSupabaseClient();

    if (isSupabaseAvailable && supabase) {
      console.log('⚡ [Persistence] Using Supabase PostgreSQL Production Repositories');
      this.productRepo = new SupabaseProductRepository(supabase);
      this.categoryRepo = new SupabaseCategoryRepository(supabase);
      this.orderRepo = new SupabaseOrderRepository(supabase);
      this.inventoryRepo = new SupabaseInventoryRepository(supabase);
      this.paymentRepo = new SupabasePaymentRepository(supabase);
      this.userRepo = new SupabaseUserRepository(supabase);
      this.addressRepo = new JsonAddressRepository();
      this.auditLogRepo = new SupabaseAuditLogRepository(supabase);
      this.settingsRepo = new SupabaseSettingsRepository(supabase);
    } else {
      console.log('📁 [Persistence] Using Local JSON Store (Development/Test Mode)');
      this.productRepo = new JsonProductRepository();
      this.categoryRepo = new JsonCategoryRepository();
      this.orderRepo = new JsonOrderRepository();
      this.inventoryRepo = new JsonInventoryRepository();
      this.paymentRepo = new JsonPaymentRepository();
      this.userRepo = new JsonUserRepository();
      this.addressRepo = new JsonAddressRepository();
      this.auditLogRepo = new JsonAuditLogRepository();
      this.settingsRepo = new JsonSettingsRepository();
    }
  }

  public static getInstance(): RepositoryContainer {
    if (!RepositoryContainer.instance) {
      RepositoryContainer.instance = new RepositoryContainer();
    }
    return RepositoryContainer.instance;
  }
}

export const repositories = RepositoryContainer.getInstance();
export * from './interfaces';
