import { AbilityBuilder, Ability } from '@casl/ability'

export const AppAbility = Ability

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (role, subject) => {
  const { can, rules } = new AbilityBuilder(AppAbility)
  if (role === 'seller') {
    can('read', 'shop')
    can('read', 'shop-form')
    can('read', 'products-and-services')
    can('read', 'product-form')
    can('read', 'edit-product')
    can('read', 'service-form')
    can('read', 'edit-service')
    can('read', 'profile')
    can('read', 'edit-profile')
    can('read', 'shop-dashboard')
  } else if (role === 'customer') {
    can(['read'], 'acl-page')
    can(['read'], 'customer-dashboard')
  } else {
    can(['read', 'create', 'update', 'delete'], subject)
  }

  return rules
}

export const buildAbilityFor = (role, subject) => {
  return new AppAbility(defineRulesFor(role, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object.type
  })
}

export const defaultACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
