import { ProductTranslationType } from 'src/shared/models/shared-product-translation.model'
import { SpecificationsType, VariantsType } from 'src/shared/models/shared-product.model'

declare global {
  namespace PrismaJson {
    type Variants = VariantsType
    type Specifications = SpecificationsType
    type ProductTranslations = Pick<ProductTranslationType, 'id' | 'name' | 'description' | 'languageId'>[]
    type Receiver = {
      name: string
      phone: string
      address: string
    }
  }
}
