import { z } from "zod";

// brand
export const brandSchema = z.object({
  id: z.number().min(0),
  modeles: z.array(z.number()).optional(),
});

// type
export const typeSchema = z.object({
  id: z.number().min(0),
  brand: z.array(brandSchema).optional(),
});

// category
export const categorySchema = z.object({
  id: z.number().min(0),
  type: z.array(typeSchema).optional(),
});

// locations
export const locationSchema = z.object({
  id: z.number().min(0),
  type: z.enum(["region", "city", "department"]),
});

// AdAttributeDto
export const adAttributeSchema = z.object({
  attributeId: z.number(),
  value: z.union([
    z.array(z.number()),
    z.object({
      min: z.number(),
      max: z.number(),
    }),
  ]),
});

// Main filterDto
export const filterDtoSchema = z.object({
  search: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().max(10000000).optional(),
  locationIds: z.array(locationSchema).optional(),
  category: z.array(categorySchema),
  attributes: z.array(adAttributeSchema).optional(),
  tri: z.enum(["plus recent", "plus cher", "moins cher", "plus ancien"]),
});

export type FilterDto = z.infer<typeof filterDtoSchema>;
//?----------------------------------------------------
// Email login
export const authDtoEmailSchema = z.object({
  email: z.string().email().min(5).max(100),
  password: z.string().min(8).max(30),
});

// Phone login
export const authDtoPhoneSchema = z.object({
  phone: z.string().min(10).max(15).regex(/^\d+$/),
  password: z.string().min(8).max(30),
});

// Username login
export const authDtoSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(8).max(30),
});

// Company DTO
export const companyDtoSchema = z.object({
  name: z.string().min(4).max(30),
  siret: z.string().length(14).regex(/^\d+$/),
  address: z.string().max(100).optional(),
});

// User DTO
export const userDtoSchema = z.object({
  company: companyDtoSchema.optional(),
  fullName: z.string().min(3).max(30),
  username: z.string().min(3).max(30),
  userType: z.enum(["INDIVIDUAL", "PROFESSIONAL"]),
  phone: z.string().min(10).max(15).regex(/^\d+$/),
  email: z.string().email().min(5).max(100),
  password: z.string().min(8).max(30),
  verificationCode: z.string().length(6).regex(/^\d+$/),
});

// SendCode DTO
export const sendCodeDtoSchema = z.object({
  email: z.string().email().min(5).max(100),
});

export type AuthDtoEmail = z.infer<typeof authDtoEmailSchema>;
export type AuthDtoPhone = z.infer<typeof authDtoPhoneSchema>;
export type AuthDto = z.infer<typeof authDtoSchema>;
export type UserDto = z.infer<typeof userDtoSchema>;
export type CompanyDto = z.infer<typeof companyDtoSchema>;
export type SendCodeDto = z.infer<typeof sendCodeDtoSchema>;

export const createAdAttributeSchema = z.object({
    attributeId: z.number().min(0),
    attributeCollectionId: z.number().min(0),
    value: z.any(),
  });
  
  export const createAdsSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    price: z.number().int().min(0),
    status: z.enum(['ACTIVE', 'SOLD', 'HIDDEN']),
    images: z.array(z.string()),
    videoid: z.number().optional(),
    attributes: z.array(createAdAttributeSchema).optional(),
    categoryId: z.number().min(0),
    typeId: z.number().min(0),
    brandId: z.number().min(0),
    modelId: z.number().min(0),
    locationId: z.number().min(0),
  });
  
  export const messageSchema = z.object({
    id: z.number().min(0),
    content: z.string().min(1),
  });
  
  export type MessageFormValues = z.infer<typeof messageSchema>;
  // UpdateAdsDto is PartialType(CreateAdsDto)
  export const updateAdsSchema = createAdsSchema.partial();
  
  export type CreateAdsFormValues = z.infer<typeof createAdsSchema>;
  export type UpdateAdsFormValues = z.infer<typeof updateAdsSchema>;