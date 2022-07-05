import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Organization } from './organization.entity';

type Google = {
  clientId: string;
};
type Git = {
  clientId: string;
  clientSecret: string;
};
type Polydocs = {
  clientId: string;
  clientSecret: string;
  url: string;
};

@Entity({ name: 'sso_configs' })
export class SSOConfigs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @Column({ name: 'sso' })
  sso: 'google' | 'git' | 'polydocs' | 'form';

  @Column({ type: 'json' })
  configs: Google | Git | Polydocs;

  @Column({ name: 'enabled' })
  enabled: boolean;

  @CreateDateColumn({ default: () => 'now()', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'now()', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Organization, (organization) => organization.id)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
